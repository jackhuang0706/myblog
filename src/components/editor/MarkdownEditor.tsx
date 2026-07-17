import { useRef, useState, type ChangeEvent } from 'react'
import MarkdownRenderer from '../docs/MarkdownRenderer'
import {
  uploadMediaFile,
  isAllowedUploadFile,
  UploadTypeError,
  BucketMissingError,
  UPLOAD_ACCEPT,
} from '../../lib/storage'
import { isSupabaseConfigured } from '../../lib/supabase'
import { useI18n } from '../../i18n'

interface Props {
  value: string
  onChange: (value: string) => void
}

/** Markdown 編輯器：可切換編輯 / 即時預覽（含數學式渲染），支援上傳圖片／影音並插入 ![]() 語法 */
export default function MarkdownEditor({ value, onChange }: Props) {
  const { t } = useI18n()
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 在游標處插入語法，讓使用者自由決定媒體放在文章的哪個位置；預覽模式下插到文末
  const insertAtCursor = (snippet: string) => {
    const el = textareaRef.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    onChange(value.slice(0, start) + snippet + value.slice(end))
    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      const pos = start + snippet.length
      el.setSelectionRange(pos, pos)
    })
  }

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = '' // 允許重複選同一個檔案
    if (files.length === 0) return
    // 先整批檢查類型，避免上傳到一半才失敗、部分檔案已進儲存空間
    const invalid = files.find((file) => !isAllowedUploadFile(file))
    if (invalid) {
      setUploadError(`${t('admin_uploadTypeInvalid')}（${invalid.name}）`)
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      const snippets: string[] = []
      for (const file of files) {
        const url = await uploadMediaFile(file)
        const alt = file.name.replace(/\.[^.]+$/, '')
        snippets.push(`![${alt}](${url})`)
      }
      insertAtCursor(snippets.join('\n\n'))
    } catch (err) {
      if (err instanceof UploadTypeError) {
        setUploadError(`${t('admin_uploadTypeInvalid')}（${err.message}）`)
      } else if (err instanceof BucketMissingError) {
        setUploadError(t('admin_uploadBucketMissing'))
      } else {
        setUploadError(`${t('admin_uploadError')}${(err as Error).message}`)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
      <div className="flex items-center border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
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
        <input
          ref={fileInputRef}
          type="file"
          accept={UPLOAD_ACCEPT}
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => {
            if (!isSupabaseConfigured) {
              setUploadError(t('admin_needSupabase'))
              return
            }
            fileInputRef.current?.click()
          }}
          disabled={uploading}
          title={t('admin_uploadHint')}
          className="ml-auto mr-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          {uploading ? t('admin_uploading') : `📎 ${t('admin_upload')}`}
        </button>
      </div>
      {uploadError && (
        <p className="border-b border-gray-200 bg-red-50 px-4 py-2 text-xs text-red-600 dark:border-gray-700 dark:bg-red-950/40 dark:text-red-400">
          {uploadError}
        </p>
      )}
      {tab === 'edit' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={18}
          spellCheck={false}
          className="w-full resize-y bg-white p-4 font-mono text-sm outline-none dark:bg-gray-950"
          placeholder="# 標題&#10;&#10;支援 Markdown 與數學式，例如 $E = mc^2$&#10;&#10;圖片與影片：點右上「上傳檔案」（支援 jpg / jpeg / png / mp4 / mov）會自動在游標處插入 ![說明](網址)，影片網址會自動變成播放器&#10;&#10;<!-- HTML 註解不會顯示在文章中 -->&#10;&#10;<details>&#10;<summary>Toggle 標題</summary>&#10;&#10;收合的內容（支援 Markdown）&#10;&#10;</details>"
        />
      ) : (
        <div className="min-h-[24rem] bg-white p-4 dark:bg-gray-950">
          <MarkdownRenderer content={value || '_（沒有內容）_'} />
        </div>
      )}
    </div>
  )
}
