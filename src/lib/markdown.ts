/** 移除 HTML 註解（<!-- ... -->）：註解不會呈現給讀者，目錄、字數、搜尋等依原文計算的功能也應排除 */
export function stripHtmlComments(markdown: string): string {
  return markdown.replace(/<!--[\s\S]*?-->/g, '')
}
