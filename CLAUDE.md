# 技術棧
- 前端使用 React + Tailwind CSS
- 後端使用 supabase
# 專案結構(可以不用一樣，但盡量不差太多)
docs-site/
├── src/
│   ├── pages/
│   │   ├── docs/              # 讀者看的文件頁面（一般存取）
│   │   └── admin/             # 編輯者專用頁面（需登入）
│   │       ├── login/
│   │       ├── posts/         # 文章列表、新增、編輯
│   │       └── layout.tsx     # 編輯區的共用外框（側邊欄、驗證檢查）
│   ├── components/
│   │   ├── layout/
│   │   ├── docs/              # 文件顯示相關元件
│   │   ├── editor/            # 編輯器元件（富文本或 Markdown 編輯器）
│   │   └── ui/
│   ├── hooks/
│   │   ├── useAuth.ts          # 包裝 Supabase Auth 狀態
│   │   └── usePosts.ts         # 讀寫文章資料
│   ├── lib/
│   │   └── supabase.ts         # Supabase client 初始化
│   ├── styles/
│   └── types/
├── public/
├── tailwind.config.ts
├── vite.config.ts
└── package.json
# 專案特色
- 網站風格：現代化與科技感
- 網站以markdown為主呈現，包含數學式的mathtex正確渲染
- 支援淺色與深色切換，預設淺色
- 支援可以新增多語言的功能，預設中文
- 支援網站搜尋功能(關鍵字搜尋內容及標題)
- 有子頁面可顯示發布新增內容的時間線
- 具有admin頁面可以新增，修改內容，並且自動偵測時間
- 每篇文章根據markdown標題生成每篇文章的目錄
- 進入首頁有動畫，並且根據Fijjj's Blog這個主題生成一個網頁logo，首頁內容以welcome這種文字為主，搭配動態背景呈現
- 每篇文章新增tags功能
- 在docs頁面預覽文章時，包含標題，新增日期，預覽內容，tags，其中預覽內容和tags在新增文章時可加（optional），如果沒有則預覽時該處留白。
- admin界面刪除文章旁有一個修改的button