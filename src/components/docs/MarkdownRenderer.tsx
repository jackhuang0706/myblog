import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import { slugifyHeading } from '../../lib/toc'

// 啟用 rehype-raw 後 HTML 註解會被解析為 comment node（不渲染），
// <details>/<summary> 則作為 toggle list 呈現；其餘可執行的 HTML 一律移除
const DANGEROUS_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base', 'form'])

interface HastLikeNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastLikeNode[]
}

function cleanNode(node: HastLikeNode): void {
  if (!node.children) return
  node.children = node.children.filter(
    (child) => !(child.type === 'element' && DANGEROUS_TAGS.has(child.tagName ?? '')),
  )
  for (const child of node.children) {
    if (child.type === 'element' && child.properties) {
      for (const key of Object.keys(child.properties)) {
        const value = child.properties[key]
        if (/^on/i.test(key)) delete child.properties[key]
        else if (typeof value === 'string' && /^\s*javascript:/i.test(value)) delete child.properties[key]
      }
    }
    cleanNode(child)
  }
}

function rehypeSafeHtml() {
  return (tree: unknown) => cleanNode(tree as HastLikeNode)
}

function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (typeof node === 'object' && 'props' in node) {
    return textOf((node.props as { children?: ReactNode }).children)
  }
  return ''
}

// 標題加上 id，讓文章目錄可以錨點跳轉
function makeHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4') {
  return function Heading({ children }: { children?: ReactNode }) {
    return <Tag id={slugifyHeading(textOf(children))}>{children}</Tag>
  }
}

// toggle list：<details>/<summary> 樣式（原生開合行為，無需 JS）
function Details({ node: _node, children, ...props }: JSX.IntrinsicElements['details'] & { node?: unknown }) {
  return (
    <details
      className="my-4 rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-2 open:pb-3 dark:border-gray-700 dark:bg-gray-900/60"
      {...props}
    >
      {children}
    </details>
  )
}

function Summary({ node: _node, children, ...props }: JSX.IntrinsicElements['summary'] & { node?: unknown }) {
  return (
    <summary
      className="cursor-pointer select-none py-1 font-medium marker:text-primary-600 dark:marker:text-primary-400"
      {...props}
    >
      {children}
    </summary>
  )
}

const components = {
  h1: makeHeading('h1'),
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
  h4: makeHeading('h4'),
  details: Details,
  summary: Summary,
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h1:mb-3 prose-h1:mt-10 prose-h1:text-2xl prose-h2:mb-2 prose-h2:mt-8 prose-h2:text-xl prose-h3:mb-2 prose-h3:mt-6 prose-h3:text-lg prose-pre:bg-gray-100 prose-pre:text-gray-800 dark:prose-pre:bg-gray-900 dark:prose-pre:text-gray-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeSafeHtml, rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
