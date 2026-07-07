import { Link, NavLink } from 'react-router-dom'
import { useI18n, languageNames } from '../../i18n'
import { useTheme } from '../../hooks/useTheme'
import type { Language } from '../../types'
import SearchBar from '../docs/SearchBar'
import Logo from './Logo'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-primary-50 text-primary-700 dark:bg-primary-700/20 dark:text-primary-100'
      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
  }`

// 管理後台不放導覽列，直接以網址 /admin 進入
export default function Header() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="mr-2 flex items-center gap-2">
          <Logo size={26} />
          <span className="bg-gradient-to-r from-cyan-500 via-primary-600 to-purple-500 bg-clip-text text-lg font-bold text-transparent">
            {t('siteTitle')}
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/docs" className={navLinkClass}>
            {t('nav_docs')}
          </NavLink>
          <NavLink to="/timeline" className={navLinkClass}>
            {t('nav_timeline')}
          </NavLink>
          <a
            href="https://newsprovider.fijjj.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {t('nav_news')} ↗
          </a>
          <a
            href="https://travelrecorder.fijjj.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {t('nav_travel')} ↗
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchBar />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            aria-label="Language"
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            {(Object.keys(languageNames) as Language[]).map((code) => (
              <option key={code} value={code}>
                {languageNames[code]}
              </option>
            ))}
          </select>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'light' ? t('theme_light') : t('theme_dark')}
            title={theme === 'light' ? t('theme_light') : t('theme_dark')}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  )
}
