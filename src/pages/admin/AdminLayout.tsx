import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useI18n } from '../../i18n'
import { isSupabaseConfigured } from '../../lib/supabase'

/** 編輯區共用外框：側邊欄 + 登入驗證檢查 */
export default function AdminLayout() {
  const { session, loading, signOut } = useAuth()
  const { t } = useI18n()
  const location = useLocation()

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
        <p className="font-medium">⚠️ {t('admin_needSupabase')}</p>
        <pre className="mt-3 overflow-x-auto rounded bg-white/60 p-3 text-xs dark:bg-black/30">
{`cp .env.example .env
# 填入 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY
# 並在 Supabase 執行 supabase/schema.sql`}
        </pre>
      </div>
    )
  }

  if (loading) return <p className="text-gray-500">{t('loading')}</p>

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-700/20 dark:text-primary-100'
        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
    }`

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <aside className="w-full shrink-0 md:w-52">
        <nav className="space-y-1">
          <NavLink to="/admin/posts" end className={linkClass}>
            {t('admin_posts')}
          </NavLink>
          <NavLink to="/admin/posts/new" className={linkClass}>
            {t('admin_newPost')}
          </NavLink>
          <button
            onClick={signOut}
            className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            {t('admin_logout')}
          </button>
        </nav>
        <p className="mt-4 px-3 text-xs text-gray-400 dark:text-gray-500">{session.user.email}</p>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
