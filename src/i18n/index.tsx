import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Language } from '../types'

// 新增語言：在 Language 型別加上代碼，並在此補一份字典即可。
const translations = {
  zh: {
    siteTitle: "Fijjj's Blog",
    nav_docs: '文件',
    nav_timeline: '時間線',
    nav_news: '新聞爬蟲',
    nav_travel: '旅行紀錄',
    home_welcome: '歡迎來到',
    home_tagline: '以 Markdown 書寫的個人知識庫，記錄技術、數學與各種想法。',
    home_browseDocs: '瀏覽文件',
    home_viewTimeline: '查看時間線',
    toc_title: '目錄',
    search_placeholder: '搜尋標題或內容…',
    search_noResults: '找不到符合的內容',
    docs_allPosts: '所有文件',
    docs_empty: '目前沒有文章',
    docs_notFound: '找不到這篇文章',
    docs_backToList: '回到文件列表',
    docs_publishedAt: '發布於',
    docs_updatedAt: '更新於',
    timeline_title: '發布時間線',
    timeline_desc: '依時間排序的內容更新紀錄',
    login_title: '編輯者登入',
    login_email: '電子郵件',
    login_password: '密碼',
    login_submit: '登入',
    login_loading: '登入中…',
    login_error: '登入失敗，請檢查帳號密碼',
    admin_posts: '文章管理',
    admin_newPost: '新增文章',
    admin_editPost: '編輯文章',
    admin_logout: '登出',
    admin_title: '標題',
    admin_slug: '網址代稱（slug）',
    admin_content: '內容（Markdown）',
    admin_lang: '語言',
    admin_tags: '標籤（選填，以逗號分隔）',
    admin_excerpt: '預覽摘要（選填，顯示在文件列表卡片）',
    admin_published: '發布',
    admin_draft: '草稿',
    admin_status: '狀態',
    admin_save: '儲存',
    admin_saving: '儲存中…',
    admin_delete: '刪除',
    admin_deleteConfirm: '確定要刪除這篇文章嗎？',
    admin_preview: '預覽',
    admin_edit: '編輯',
    admin_empty: '還沒有任何文章，點「新增文章」開始撰寫。',
    admin_createdAt: '建立時間',
    admin_views: '瀏覽數',
    admin_heatmapTitle: '發布字數熱力圖（依發布日統計每日總字數）',
    admin_heatmapUnit: '字',
    admin_heatmapLess: '少',
    admin_heatmapMore: '多',
    admin_autoTime: '建立與更新時間會自動記錄',
    admin_needSupabase: '尚未設定 Supabase。請複製 .env.example 為 .env 並填入金鑰，後台功能才能使用。',
    admin_migrationNeeded:
      '文章已儲存，但資料庫尚無標籤與摘要欄位，這兩項未存入。請在 Supabase SQL Editor 執行 supabase/schema.sql，再編輯文章補上。',
    theme_light: '切換為深色模式',
    theme_dark: '切換為淺色模式',
    loading: '載入中…',
  },
  en: {
    siteTitle: "Fijjj's Blog",
    nav_docs: 'Docs',
    nav_timeline: 'Timeline',
    nav_news: 'News Crawler',
    nav_travel: 'Travel Records',
    home_welcome: 'Welcome to',
    home_tagline: 'A personal knowledge base written in Markdown — tech, math, and everything in between.',
    home_browseDocs: 'Browse Docs',
    home_viewTimeline: 'View Timeline',
    toc_title: 'On this page',
    search_placeholder: 'Search title or content…',
    search_noResults: 'No results found',
    docs_allPosts: 'All Documents',
    docs_empty: 'No posts yet',
    docs_notFound: 'Post not found',
    docs_backToList: 'Back to list',
    docs_publishedAt: 'Published',
    docs_updatedAt: 'Updated',
    timeline_title: 'Timeline',
    timeline_desc: 'Content updates in chronological order',
    login_title: 'Editor Login',
    login_email: 'Email',
    login_password: 'Password',
    login_submit: 'Sign in',
    login_loading: 'Signing in…',
    login_error: 'Login failed. Check your credentials.',
    admin_posts: 'Posts',
    admin_newPost: 'New Post',
    admin_editPost: 'Edit Post',
    admin_logout: 'Sign out',
    admin_title: 'Title',
    admin_slug: 'Slug',
    admin_content: 'Content (Markdown)',
    admin_lang: 'Language',
    admin_tags: 'Tags (optional, comma-separated)',
    admin_excerpt: 'Excerpt (optional, shown on list cards)',
    admin_published: 'Published',
    admin_draft: 'Draft',
    admin_status: 'Status',
    admin_save: 'Save',
    admin_saving: 'Saving…',
    admin_delete: 'Delete',
    admin_deleteConfirm: 'Delete this post?',
    admin_preview: 'Preview',
    admin_edit: 'Edit',
    admin_empty: 'No posts yet. Click "New Post" to start writing.',
    admin_createdAt: 'Created at',
    admin_views: 'Views',
    admin_heatmapTitle: 'Contribution Heatmap (words published per day)',
    admin_heatmapUnit: 'words',
    admin_heatmapLess: 'Less',
    admin_heatmapMore: 'More',
    admin_autoTime: 'Creation and update times are recorded automatically',
    admin_needSupabase: 'Supabase is not configured. Copy .env.example to .env and fill in your keys to use the admin panel.',
    admin_migrationNeeded:
      'The post was saved, but the database is missing the tags/excerpt columns, so those fields were not stored. Run supabase/schema.sql in the Supabase SQL Editor, then edit the post again.',
    theme_light: 'Switch to dark mode',
    theme_dark: 'Switch to light mode',
    loading: 'Loading…',
  },
} as const

export type TranslationKey = keyof (typeof translations)['zh']

export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
}

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang')
    return saved === 'en' ? 'en' : 'zh' // 預設中文
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en'
  }, [lang])

  const t = (key: TranslationKey) => translations[lang][key]

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
