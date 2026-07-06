import type { Post } from '../types'

// 尚未連接 Supabase 時顯示的範例文章，方便本地預覽整個網站功能。
export const samplePosts: Post[] = [
  {
    id: 'sample-1',
    slug: 'welcome',
    title: '歡迎來到我的文件站',
    lang: 'zh',
    tags: ['公告', '入門'],
    excerpt: '網站功能總覽：Markdown、數學式、主題切換、搜尋與後台管理。',
    published: true,
    views: 0,
    created_at: '2026-07-01T09:00:00Z',
    updated_at: '2026-07-01T09:00:00Z',
    content: `# 歡迎 👋

這是一個以 **Markdown** 為主的個人文件網站，支援：

- 淺色 / 深色主題切換
- 中文與英文介面
- 全站關鍵字搜尋（標題與內容）
- 發布時間線
- Admin 後台管理文章

> 目前顯示的是內建範例文章。設定好 \`.env\` 中的 Supabase 金鑰後，內容將改為從資料庫讀取。

## 程式碼範例

\`\`\`ts
function greet(name: string) {
  return \`Hello, \${name}!\`
}
\`\`\`
`,
  },
  {
    id: 'sample-2',
    slug: 'math-notes',
    title: '數學筆記：尤拉公式',
    lang: 'zh',
    tags: ['數學'],
    excerpt: null,
    published: true,
    views: 0,
    created_at: '2026-07-02T14:30:00Z',
    updated_at: '2026-07-02T14:30:00Z',
    content: `# 尤拉公式

數學式透過 KaTeX 渲染。行內式如 $e^{i\\pi} + 1 = 0$，區塊式：

$$
e^{ix} = \\cos x + i \\sin x
$$

## 泰勒展開

$$
e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots
$$

矩陣也沒問題：

$$
\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}
\\begin{pmatrix} x \\\\ y \\end{pmatrix}
=
\\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}
$$
`,
  },
  {
    id: 'sample-3',
    slug: 'getting-started-en',
    title: 'Getting Started (English sample)',
    lang: 'en',
    tags: [],
    excerpt: null,
    published: true,
    views: 0,
    created_at: '2026-07-03T08:00:00Z',
    updated_at: '2026-07-03T08:00:00Z',
    content: `# Getting Started

This is an English sample post. The site supports multiple languages — the UI defaults to Traditional Chinese and can be switched to English.

Inline math works here too: $\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}$.
`,
  },
]
