import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { slugifyHeading } from '../../lib/toc'

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

const components = {
  h1: makeHeading('h1'),
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
  h4: makeHeading('h4'),
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h1:mb-3 prose-h1:mt-10 prose-h1:text-2xl prose-h2:mb-2 prose-h2:mt-8 prose-h2:text-xl prose-h3:mb-2 prose-h3:mt-6 prose-h3:text-lg prose-pre:bg-gray-100 prose-pre:text-gray-800 dark:prose-pre:bg-gray-900 dark:prose-pre:text-gray-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
