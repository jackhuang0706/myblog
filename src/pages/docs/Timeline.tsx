import { Link } from 'react-router-dom'
import { usePosts } from '../../hooks/usePosts'
import { useI18n } from '../../i18n'
import { formatDate } from '../../lib/format'

export default function Timeline() {
  const { t, lang } = useI18n()
  const { posts, loading } = usePosts()

  if (loading) return <p className="text-gray-500">{t('loading')}</p>

  // 依年份分組（posts 已由新到舊排序）
  const byYear = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.created_at).getFullYear().toString()
    ;(acc[year] ??= []).push(post)
    return acc
  }, {})
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">{t('timeline_title')}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('timeline_desc')}</p>
      {years.map((year) => (
        <section key={year} className="mt-8">
          <h2 className="text-lg font-semibold text-primary-600 dark:text-primary-100">{year}</h2>
          <ol className="mt-3 border-l-2 border-gray-200 dark:border-gray-800">
            {byYear[year].map((post) => (
              <li key={post.id} className="relative mb-6 pl-6">
                <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-primary-500 dark:border-gray-950" />
                <time className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(post.created_at, lang)}
                </time>
                <Link
                  to={`/docs/${post.slug}`}
                  className="mt-0.5 block font-medium hover:text-primary-600 dark:hover:text-primary-100"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
      {posts.length === 0 && <p className="mt-8 text-gray-500">{t('docs_empty')}</p>}
    </div>
  )
}
