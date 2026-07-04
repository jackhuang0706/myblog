import { useState } from 'react'
import MarkdownRenderer from '../docs/MarkdownRenderer'
import { useI18n } from '../../i18n'

interface Props {
  value: string
  onChange: (value: string) => void
}

/** Markdown 編輯器：可切換編輯 / 即時預覽（含數學式渲染） */
export default function MarkdownEditor({ value, onChange }: Props) {
  const { t } = useI18n()
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
      <div className="flex border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        {(['edit', 'preview'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setTab(mode)}
            className={`px-4 py-2 text-sm font-medium transition ${
              tab === mode
                ? 'border-b-2 border-primary-600 text-primary-700 dark:text-primary-100'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {mode === 'edit' ? t('admin_edit') : t('admin_preview')}
          </button>
        ))}
      </div>
      {tab === 'edit' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={18}
          spellCheck={false}
          className="w-full resize-y bg-white p-4 font-mono text-sm outline-none dark:bg-gray-950"
          placeholder="# 標題&#10;&#10;支援 Markdown 與數學式，例如 $E = mc^2$"
        />
      ) : (
        <div className="min-h-[24rem] bg-white p-4 dark:bg-gray-950">
          <MarkdownRenderer content={value || '_（沒有內容）_'} />
        </div>
      )}
    </div>
  )
}
