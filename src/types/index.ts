export interface Post {
  id: string
  slug: string
  title: string
  content: string
  lang: string
  tags: string[]
  excerpt: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type Language = 'zh' | 'en'

export type Theme = 'light' | 'dark'
