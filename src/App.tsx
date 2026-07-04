import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { I18nProvider } from './i18n'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import DocsList from './pages/docs/DocsList'
import DocPage from './pages/docs/DocPage'
import Timeline from './pages/docs/Timeline'
import AdminLayout from './pages/admin/AdminLayout'
import Login from './pages/admin/Login'
import PostsList from './pages/admin/PostsList'
import PostEdit from './pages/admin/PostEdit'

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<DocsList />} />
            <Route path="/docs/:slug" element={<DocPage />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/posts" replace />} />
              <Route path="posts" element={<PostsList />} />
              <Route path="posts/new" element={<PostEdit />} />
              <Route path="posts/:id" element={<PostEdit />} />
            </Route>
            <Route path="*" element={<Navigate to="/docs" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}
