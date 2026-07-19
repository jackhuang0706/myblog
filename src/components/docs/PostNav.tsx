import { Link } from 'react-router-dom'
import type { Post } from '../../types'
import { useI18n } from '../../i18n'

interface PostNavProps {
  prev: Post | null
  next: Post | null
}

/** 文章頁底部的上一篇／下一篇區塊：左右各佔一半、等高，缺少其中一篇時以空區塊保留寬高 */
export default function PostNav({ prev, next }: PostNavProps) {
  const { t } = useI18n()
  if (!prev && !next) return null

  const blockClass =
    'group flex h-full flex-col gap-1 rounded-lg border border-gray-200 p-4 transition-colors ' +
    'hover:border-primary-400 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-primary-300 dark:hover:bg-gray-900'

  return (
    <nav className="mt-12 grid grid-cols-2 items-stretch gap-4 border-t border-gray-200 pt-8 dark:border-gray-800">
      {prev ? (
        <Link to={`/docs/${prev.slug}`} className={blockClass}>
          <span className="text-sm text-gray-400 dark:text-gray-500">← {t('docs_prevPost')}</span>
          <span className="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-100">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
      {next ? (
        <Link to={`/docs/${next.slug}`} className={`${blockClass} items-end text-right`}>
          <span className="text-sm text-gray-400 dark:text-gray-500">{t('docs_nextPost')} →</span>
          <span className="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-100">
            {next.title}
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  )
}
