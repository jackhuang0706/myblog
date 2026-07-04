import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useI18n } from '../../i18n'

export default function Login() {
  const { signIn } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signIn(email, password)
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
      navigate(from ?? '/admin/posts', { replace: true })
    } catch {
      setError(t('login_error'))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-primary-700/30'

  return (
    <div className="mx-auto mt-12 max-w-sm">
      <h1 className="mb-6 text-center text-2xl font-bold">{t('login_title')}</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-gray-200 p-6 dark:border-gray-800"
      >
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            {t('login_email')}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            {t('login_password')}
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary-600 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {submitting ? t('login_loading') : t('login_submit')}
        </button>
      </form>
    </div>
  )
}
