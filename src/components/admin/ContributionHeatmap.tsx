import { useMemo } from 'react'
import type { Post } from '../../types'
import { useI18n } from '../../i18n'
import { countWords } from '../../lib/wordCount'

interface DayCell {
  date: Date
  count: number
}

// 顏色深淺 5 級：0 = 當天沒有發布，1–4 依字數相對當年最大值遞增
const LEVEL_CLASSES = [
  'bg-gray-100 dark:bg-gray-800',
  'bg-primary-100 dark:bg-primary-700/30',
  'bg-primary-500/50 dark:bg-primary-700/60',
  'bg-primary-500 dark:bg-primary-600',
  'bg-primary-700 dark:bg-primary-500',
]

function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function level(count: number, max: number): number {
  if (count <= 0 || max <= 0) return 0
  return Math.min(4, 1 + Math.floor((3 * count) / max))
}

/** 後台貢獻熱力圖：以已發布文章的發布日統計每日總字數，GitHub 風格呈現最近一年 */
export default function ContributionHeatmap({ posts }: { posts: Post[] }) {
  const { t, lang } = useI18n()

  const { weeks, max } = useMemo(() => {
    const totals = new Map<string, number>()
    for (const post of posts) {
      if (!post.published) continue
      const key = dateKey(new Date(post.created_at))
      totals.set(key, (totals.get(key) ?? 0) + countWords(post.content))
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(today)
    start.setDate(start.getDate() - start.getDay() - 7 * 52) // 53 週前的週日

    const weeks: DayCell[][] = []
    let max = 0
    for (const d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const date = new Date(d)
      if (date.getDay() === 0) weeks.push([])
      const count = totals.get(dateKey(date)) ?? 0
      if (count > max) max = count
      weeks[weeks.length - 1].push({ date, count })
    }
    return { weeks, max }
  }, [posts])

  // 每欄（週）在該週跨入新月份時顯示月份標籤
  const monthLabels = weeks.map((week, i) => {
    const month = week[0].date.getMonth()
    if (i === 0 || month === weeks[i - 1][0].date.getMonth()) return null
    return lang === 'zh'
      ? `${month + 1}月`
      : week[0].date.toLocaleDateString('en-US', { month: 'short' })
  })

  const weekdayLabels = lang === 'zh' ? ['一', '三', '五'] : ['Mon', 'Wed', 'Fri']

  return (
    <div className="mb-6 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <h2 className="mb-3 text-sm font-semibold">{t('admin_heatmapTitle')}</h2>
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="ml-[34px] flex text-[10px] text-gray-400 dark:text-gray-500">
            {monthLabels.map((label, i) => (
              <span key={i} className="w-[13px] shrink-0 overflow-visible whitespace-nowrap">
                {label}
              </span>
            ))}
          </div>
          <div className="mt-1 flex gap-[2px]">
            <div className="relative w-8 shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
              {weekdayLabels.map((label, i) => (
                <span key={label} className="absolute left-0" style={{ top: `${(i * 2 + 1) * 13}px` }}>
                  {label}
                </span>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.map((day) => (
                  <div
                    key={dateKey(day.date)}
                    title={`${dateKey(day.date)} · ${day.count.toLocaleString()} ${t('admin_heatmapUnit')}`}
                    className={`h-[11px] w-[11px] rounded-sm ${LEVEL_CLASSES[level(day.count, max)]}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-gray-400 dark:text-gray-500">
            <span>{t('admin_heatmapLess')}</span>
            {LEVEL_CLASSES.map((cls) => (
              <div key={cls} className={`h-[11px] w-[11px] rounded-sm ${cls}`} />
            ))}
            <span>{t('admin_heatmapMore')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
