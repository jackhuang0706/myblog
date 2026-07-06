/** 計算文章字數：中日韓字元逐字計，其餘文字以空白分隔的單字計 */
const CJK_PATTERN = /[㐀-䶿一-鿿぀-ヿ가-힯]/g

export function countWords(text: string): number {
  const cjkCount = text.match(CJK_PATTERN)?.length ?? 0
  const wordCount = text
    .replace(CJK_PATTERN, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return cjkCount + wordCount
}
