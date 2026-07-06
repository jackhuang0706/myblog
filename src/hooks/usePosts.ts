import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { samplePosts } from '../lib/samplePosts'
import type { Post } from '../types'

interface UsePostsOptions {
  /** true：含草稿（admin 用）；false：只取已發布 */
  includeDrafts?: boolean
  /** 指定語言時只取該語言的文章（讀者頁面依介面語言過濾；admin 不傳，顯示全部） */
  lang?: string
}

// 資料表若是舊版 schema（缺 tags/excerpt/views 欄位），撈回的資料會沒有這些屬性，
// 前端直接使用 post.tags 會 crash，因此讀取後一律補上預設值。
function normalizePost(row: unknown): Post {
  const post = row as Post
  return {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : [],
    excerpt: post.excerpt ?? null,
    views: typeof post.views === 'number' ? post.views : 0,
  }
}

/** 判斷是否為資料表缺少 tags/excerpt 欄位的錯誤（重跑 schema.sql 可補上） */
function isMissingColumnError(error: { code?: string; message?: string }): boolean {
  return (
    (error.code === '42703' || error.code === 'PGRST204') &&
    /tags|excerpt/.test(error.message ?? '')
  )
}

export function usePosts({ includeDrafts = false, lang }: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    if (!supabase) {
      const fallback = includeDrafts ? [] : samplePosts
      setPosts(lang ? fallback.filter((p) => p.lang === lang) : fallback)
      setLoading(false)
      return
    }
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false })
    if (!includeDrafts) query = query.eq('published', true)
    if (lang) query = query.eq('lang', lang)
    const { data, error } = await query
    if (error) setError(error.message)
    else setPosts((data ?? []).map(normalizePost))
    setLoading(false)
  }, [includeDrafts, lang])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return { posts, loading, error, refresh: fetchPosts }
}

// 同一瀏覽 session 內每篇文章只累計一次，也避免 StrictMode 重複執行 effect 造成重複計數
const viewedSlugs = new Set<string>()

/** 讀者開啟文章時累計瀏覽數（fire-and-forget，失敗不影響閱讀） */
export function incrementPostViews(slug: string): void {
  if (!supabase || viewedSlugs.has(slug)) return
  viewedSlugs.add(slug)
  supabase.rpc('increment_post_views', { post_slug: slug }).then(({ error }) => {
    // 資料庫尚未執行新版 schema.sql（缺 function）時靜默略過
    if (error) console.warn('increment_post_views failed:', error.message)
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!supabase) {
    return samplePosts.find((p) => p.slug === slug) ?? null
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) throw error
  return data ? normalizePost(data) : null
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? normalizePost(data) : null
}

export interface PostInput {
  title: string
  slug: string
  content: string
  lang: string
  tags: string[]
  excerpt: string | null
  published: boolean
}

export interface SaveResult {
  post: Post
  /** true 表示資料表缺 tags/excerpt 欄位，已改以相容模式儲存（標籤與摘要未存入） */
  needsMigration: boolean
}

/** 先以完整欄位儲存；資料表缺 tags/excerpt 時退回相容模式，避免整篇文章存不進去 */
async function savePost(
  input: PostInput,
  write: (payload: Partial<PostInput>) => PromiseLike<{ data: unknown; error: { code?: string; message: string } | null }>,
): Promise<SaveResult> {
  const { data, error } = await write(input)
  if (!error) return { post: normalizePost(data), needsMigration: false }
  if (!isMissingColumnError(error)) throw new Error(error.message)

  const { tags: _tags, excerpt: _excerpt, ...legacyInput } = input
  const retry = await write(legacyInput)
  if (retry.error) throw new Error(retry.error.message)
  return { post: normalizePost(retry.data), needsMigration: true }
}

// 建立與更新時間由資料庫自動記錄（created_at 預設 now()、updated_at 由 trigger 維護）
export async function createPost(input: PostInput): Promise<SaveResult> {
  if (!supabase) throw new Error('Supabase not configured')
  return savePost(input, (payload) => supabase!.from('posts').insert(payload).select().single())
}

export async function updatePost(id: string, input: PostInput): Promise<SaveResult> {
  if (!supabase) throw new Error('Supabase not configured')
  return savePost(input, (payload) =>
    supabase!.from('posts').update(payload).eq('id', id).select().single(),
  )
}

export async function deletePost(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}
