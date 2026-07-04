import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePosts } from '../../hooks/usePosts'
import { useI18n } from '../../i18n'

/** 標題或摘要中命中的關鍵字加上高亮 */
function highlightKeyword(snippet: string, keyword: string) {
  if (!keyword) return snippet
  const parts = snippet.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="rounded-sm bg-primary-100 px-0.5 text-primary-700 dark:bg-primary-700/40 dark:text-primary-100">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default function SearchBar() {
  const { t } = useI18n()
  const { posts } = usePosts()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return posts
      .filter(
        (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q),
      )
      .slice(0, 8)
  }, [query, posts])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder={t('search_placeholder')}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-primary-700/30"
      />
      {open && query.trim() && (
        <div className="absolute z-50 mt-2 w-full min-w-[18rem] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {t('search_noResults')}
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`/docs/${post.slug}`}
                    onClick={() => {
                      setOpen(false)
                      setQuery('')
                    }}
                    className="block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="block text-sm font-medium">
                      {highlightKeyword(post.title, query.trim())}
                    </span>
                    {/* 顯示文章的預覽摘要（選填欄位），沒有摘要則留白 */}
                    {post.excerpt && (
                      <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                        {highlightKeyword(post.excerpt, query.trim())}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
