import type { Language } from '../types'

export function formatDate(iso: string, lang: Language): string {
  return new Date(iso).toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(iso: string, lang: Language): string {
  return new Date(iso).toLocaleString(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
