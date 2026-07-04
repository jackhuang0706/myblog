import { Link } from 'react-router-dom'
import { usePosts, deletePost } from '../../hooks/usePosts'
import { useI18n } from '../../i18n'
import { formatDateTime } from '../../lib/format'

export default function PostsList() {
  const { t, lang } = useI18n()
  const { posts, loading, error, refresh } = usePosts({ includeDrafts: true })

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin_deleteConfirm'))) return
    await deletePost(id)
    refresh()
  }

  if (loading) return <p className="text-gray-500">{t('loading')}</p>
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('admin_posts')}</h1>
        <Link
          to="/admin/posts/new"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
        >
          + {t('admin_newPost')}
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-gray-500">{t('admin_empty')}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 font-medium">{t('admin_title')}</th>
                <th className="px-4 py-3 font-medium">{t('admin_status')}</th>
                <th className="px-4 py-3 font-medium">{t('admin_createdAt')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/posts/${post.id}`}
                      className="font-medium hover:text-primary-600 dark:hover:text-primary-100"
                    >
                      {post.title}
                    </Link>
                    <span className="ml-2 text-xs text-gray-400">/{post.slug}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {post.published ? t('admin_published') : t('admin_draft')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                    {formatDateTime(post.created_at, lang)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      to={`/admin/posts/${post.id}`}
                      className="mr-3 text-xs text-primary-600 hover:underline dark:text-primary-100"
                    >
                      {t('admin_edit')}
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      {t('admin_delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
