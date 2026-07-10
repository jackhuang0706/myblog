import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import Logo from '../components/layout/Logo'

// 首頁 landing：動態漸層背景 + 科技感網格 + 進場動畫
export default function Home() {
  const { t } = useI18n()

  return (
    // mx-[calc(50%-50vw)]：突破版面容器寬度限制，讓背景延伸到視窗兩側
    <section className="relative -my-8 mx-[calc(50%-50vw)] flex min-h-[calc(100vh-3.9rem)] items-center justify-center overflow-hidden px-4">
      {/* 動態背景：漂浮漸層光暈。fixed 鋪滿整個視窗，讓下方透明的 footer 也共用同一片背景 */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-tech-grid opacity-60 dark:opacity-30" />
        <div className="animate-blob absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl dark:bg-cyan-500/20" />
        <div className="animate-blob absolute right-0 top-10 h-96 w-96 rounded-full bg-primary-500/25 blur-3xl [animation-delay:-4s] dark:bg-primary-600/20" />
        <div className="animate-blob absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-400/25 blur-3xl [animation-delay:-8s] dark:bg-purple-600/20" />
      </div>

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <div className="animate-fade-up">
          <Logo size={88} />
        </div>
        <p className="animate-fade-up mt-8 text-lg font-bold text-gray-500 [animation-delay:150ms] dark:text-gray-400">
          {t('home_welcome')}
        </p>
        {/* pb-3：bg-clip-text 的背景只蓋到元素框，需留 padding 讓 j、g 的下伸部也被漸層覆蓋 */}
        <h1 className="animate-fade-up mt-2 bg-gradient-to-r from-cyan-500 via-primary-600 to-purple-500 bg-clip-text pb-3 text-5xl font-extrabold tracking-tight text-transparent [animation-delay:300ms] sm:text-6xl">
          Fijjj&apos;s Blog
        </h1>
        <p className="animate-fade-up mt-6 max-w-md font-bold text-gray-600 [animation-delay:450ms] dark:text-gray-300">
          {t('home_tagline')}
        </p>
        <div className="animate-fade-up mt-10 flex flex-wrap justify-center gap-4 [animation-delay:600ms]">
          <Link
            to="/docs"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-primary-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition hover:shadow-xl hover:shadow-primary-500/40 hover:brightness-110"
          >
            {t('home_browseDocs')} →
          </Link>
          <Link
            to="/timeline"
            className="rounded-xl border border-gray-300 bg-white/60 px-6 py-3 text-sm font-bold backdrop-blur transition hover:border-primary-500 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900/60 dark:hover:text-primary-100"
          >
            {t('home_viewTimeline')}
          </Link>
        </div>
      </div>
    </section>
  )
}
