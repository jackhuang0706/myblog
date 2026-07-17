import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    // 英文由前面的 Libre Baskerville（僅含拉丁字元）命中，中文 fallback 到 Noto Sans TC
    fontFamily: {
      sans: ['"Libre Baskerville"', '"Noto Sans TC"', 'sans-serif'],
      serif: ['"Libre Baskerville"', '"Noto Sans TC"', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
    },
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config
