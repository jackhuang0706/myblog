// Fijjj's Blog 網站 logo：六角形 + F 字母，漸層科技感
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path
        d="M24 3 L42 13.5 V34.5 L24 45 L6 34.5 V13.5 Z"
        stroke="url(#logo-grad)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M19 33 V15 H31 M19 24 H28"
        stroke="url(#logo-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
