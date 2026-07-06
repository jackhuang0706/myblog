import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug, incrementPostViews } from '../../hooks/usePosts'
import type { Post } from '../../types'
import MarkdownRenderer from '../../components/docs/MarkdownRenderer'
import TableOfContents from '../../components/docs/TableOfContents'
import { useI18n } from '../../i18n'
import { formatDate } from '../../lib/format'

export default function DocPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useI18n()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getPostBySlug(slug)
      .then((p) => {
        setPost(p)
        if (p) incrementPostViews(slug)
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="text-gray-500">{t('loading')}</p>

  if (!post) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">{t('docs_notFound')}</p>
        <Link to="/docs" className="mt-4 inline-block text-primary-600 hover:underline dark:text-primary-100">
          ← {t('docs_backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl gap-10">
      <article className="min-w-0 max-w-3xl flex-1">
        <Link
          to="/docs"
          className="mb-6 inline-block text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400"
        >
          ← {t('docs_backToList')}
        </Link>
        <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
        <p
          className={`${post.tags.length > 0 ? 'mb-3' : 'mb-8'} text-sm text-gray-400 dark:text-gray-500`}
        >
          {t('docs_publishedAt')} {formatDate(post.created_at, lang)}
          {post.updated_at !== post.created_at && (
            <> · {t('docs_updatedAt')} {formatDate(post.updated_at, lang)}</>
          )}
        </p>
        {post.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-primary-700 dark:text-primary-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <details className="mb-6 rounded-lg border border-gray-200 p-4 lg:hidden dark:border-gray-800">
          <summary className="cursor-pointer text-sm font-medium">{t('toc_title')}</summary>
          <div className="mt-3">
            <TableOfContents content={post.content} showTitle={false} />
          </div>
        </details>
        <MarkdownRenderer content={post.content} />
      </article>
      {/* 文章目錄：由 Markdown 標題自動生成，桌面版固定在右側 */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-20">
          <TableOfContents content={post.content} />
        </div>
      </aside>
    </div>
  )
}
