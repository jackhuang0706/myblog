import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPost, getPostById, updatePost } from '../../hooks/usePosts'
import MarkdownEditor from '../../components/editor/MarkdownEditor'
import { useI18n, languageNames } from '../../i18n'
import type { Language } from '../../types'

// 標題只允許中文、英文字母、數字與空格
const TITLE_PATTERN = /^[\p{Script=Han}A-Za-z0-9\s]*$/u

/** slug 由標題自動產生（不可自訂）：中文與數字照抄、英文轉小寫、空格以 - 連接 */
function slugify(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, '-')
}

export default function PostEdit() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id
  const navigate = useNavigate()
  const { t } = useI18n()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [lang, setLang] = useState('zh')
  const [tagsText, setTagsText] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isNew || !id) return
    getPostById(id)
      .then((post) => {
        if (!post) {
          setError(t('docs_notFound'))
          return
        }
        setTitle(post.title)
        setContent(post.content)
        setLang(post.lang)
        setTagsText(post.tags.join(', '))
        setExcerpt(post.excerpt ?? '')
        setPublished(post.published)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew])

  const titleInvalid = !TITLE_PATTERN.test(title)
  const slug = slugify(title)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (titleInvalid || !slug) return
    setSaving(true)
    setError(null)
    const tags = tagsText
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean)
    const input = {
      title: title.trim(),
      slug,
      content,
      lang,
      tags,
      excerpt: excerpt.trim() || null,
      published,
    }
    try {
      const result = isNew ? await createPost(input) : await updatePost(id, input)
      // 資料表缺 tags/excerpt 欄位時文章仍會儲存，但標籤與摘要不會存入，提醒補跑 migration
      if (result.needsMigration && (tags.length > 0 || input.excerpt)) {
        alert(t('admin_migrationNeeded'))
      }
      navigate('/admin/posts')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-500">{t('loading')}</p>

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-primary-700/30'

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{isNew ? t('admin_newPost') : t('admin_editPost')}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            {t('admin_title')}
          </label>
          <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          {titleInvalid && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{t('admin_titleInvalid')}</p>}
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {t('admin_slug')}：{slug ? `/docs/${slug}` : '—'}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="lang" className="mb-1 block text-sm font-medium">
              {t('admin_lang')}
            </label>
            <select id="lang" value={lang} onChange={(e) => setLang(e.target.value)} className={inputClass}>
              {(Object.keys(languageNames) as Language[]).map((code) => (
                <option key={code} value={code}>
                  {languageNames[code]}
                </option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-primary-600"
            />
            {t('admin_published')}
          </label>
          <p className="pb-2 text-xs text-gray-400 dark:text-gray-500">🕐 {t('admin_autoTime')}</p>
        </div>
        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium">
            {t('admin_tags')}
          </label>
          <input
            id="tags"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="react, 數學, 筆記"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="mb-1 block text-sm font-medium">
            {t('admin_excerpt')}
          </label>
          <textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t('admin_content')}</label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={saving || titleInvalid}
          className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? t('admin_saving') : t('admin_save')}
        </button>
      </form>
    </div>
  )
}
