import { useMemo } from 'react'
import { extractToc } from '../../lib/toc'
import { useI18n } from '../../i18n'

interface Props {
  content: string
  showTitle?: boolean
}

export default function TableOfContents({ content, showTitle = true }: Props) {
  const { t } = useI18n()
  const items = useMemo(() => extractToc(content), [content])

  if (items.length < 2) return null

  return (
    <nav aria-label={t('toc_title')} className="text-sm">
      {showTitle && (
        <p className="mb-3 font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {t('toc_title')}
        </p>
      )}
      <ul className="space-y-1.5 border-l border-gray-200 dark:border-gray-800">
        {items.map((item, i) => (
          <li key={`${item.id}-${i}`}>
            <a
              href={`#${item.id}`}
              style={{ paddingLeft: `${(item.level - 1) * 0.75 + 0.75}rem` }}
              className="-ml-px block border-l border-transparent py-0.5 text-gray-500 transition hover:border-primary-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-100"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
