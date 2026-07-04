import { Link } from 'react-router-dom'
import { usePosts } from '../../hooks/usePosts'
import { useI18n } from '../../i18n'
import { formatDate } from '../../lib/format'

export default function DocsList() {
  const { t, lang } = useI18n()
  const { posts, loading } = usePosts()

  if (loading) return <p className="text-gray-500">{t('loading')}</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('docs_allPosts')}</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">{t('docs_empty')}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/docs/${post.slug}`}
                className="flex h-full flex-col rounded-xl border border-gray-200 p-5 transition hover:border-primary-500 hover:shadow-md dark:border-gray-800 dark:hover:border-primary-500"
              >
                <h2 className="font-semibold">{post.title}</h2>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(post.created_at, lang)}
                </p>
                {/* 預覽摘要與 tags 皆為選填，沒有就留白 */}
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {post.excerpt}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-700/20 dark:text-primary-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
