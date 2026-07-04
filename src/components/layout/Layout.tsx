import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} · Built with React + Tailwind + Supabase
      </footer>
    </div>
  )
}
