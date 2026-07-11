import { stripHtmlComments } from './markdown'

export interface TocItem {
  id: string
  text: string
  level: number
}

/** 標題文字轉 anchor id（保留中日韓字元），TOC 與內文渲染共用以確保一致 */
export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

/** 從 Markdown 原文擷取標題（h1–h4），略過程式碼區塊與 HTML 註解 */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = []
  let inCodeBlock = false
  for (const line of stripHtmlComments(markdown).split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue
    const match = /^(#{1,4})\s+(.+)/.exec(line)
    if (match) {
      const text = match[2].replace(/[*_`~]/g, '').trim()
      items.push({ id: slugifyHeading(text), text, level: match[1].length })
    }
  }
  return items
}
