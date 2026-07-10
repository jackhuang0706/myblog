import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    // 中文使用 Noto Serif TC，英文由前面的 Latin serif 字體命中（Georgia 等）
    fontFamily: {
      sans: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', '"Noto Serif TC"', 'serif'],
      serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', '"Noto Serif TC"', 'serif'],
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
