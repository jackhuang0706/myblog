# 我的文件站

以 Markdown 為主的個人文件網站。React + Tailwind CSS 前端、Supabase 後端。

## 功能

- 📝 Markdown 渲染，支援 KaTeX 數學式（行內 `$...$` 與區塊 `$$...$$`）
- 🌗 淺色 / 深色主題切換（預設淺色）
- 🌐 多語言介面，預設中文，可擴充（見 `src/i18n/index.tsx`）
- 🔍 全站搜尋（關鍵字比對標題與內容）
- 🕐 發布時間線子頁面
- 📑 每篇文章依 Markdown 標題自動生成目錄（桌面版固定右側，行動版可摺疊）
- 🏷️ 文章標籤與預覽摘要（皆選填，顯示於文件列表卡片與文章頁）
- ✨ 首頁進場動畫、動態漸層背景與 Fijjj's Blog 主題 logo
- 🔐 Admin 後台（Supabase Auth 登入）：文章列表、新增、編輯、刪除，建立/更新時間自動記錄

## 開始使用

```bash
npm install
npm run dev
```

未設定 Supabase 時，前台會顯示內建範例文章，方便先預覽整個網站。

## 連接 Supabase

1. 到 [supabase.com](https://supabase.com) 建立專案
2. 在 SQL Editor 執行 `supabase/schema.sql`（建立 `posts` 資料表、RLS 政策與自動時間戳；
   對已存在的舊版資料表重複執行也安全，會自動補上標籤與摘要欄位）
3. 在 Authentication → Users 建立你的編輯者帳號（Email + 密碼）
4. 複製環境變數：

```bash
cp .env.example .env
# 填入 Project Settings → API 中的 URL 與 anon key
```

5. 重新啟動 `npm run dev`，前往 `/admin/login` 登入即可管理文章

## 專案結構

```
src/
├── pages/
│   ├── docs/          # 讀者頁面：文件列表、單篇文件、時間線
│   └── admin/         # 編輯者頁面：登入、文章管理（AdminLayout 做驗證檢查）
├── components/
│   ├── layout/        # Header、整體版面
│   ├── docs/          # Markdown 渲染、搜尋
│   └── editor/        # Markdown 編輯器（編輯/預覽切換）
├── hooks/
│   ├── useAuth.ts     # 包裝 Supabase Auth 狀態
│   ├── usePosts.ts    # 讀寫文章資料
│   └── useTheme.ts    # 主題切換
├── i18n/              # 多語言字典與 Provider
├── lib/
│   ├── supabase.ts    # Supabase client 初始化
│   ├── samplePosts.ts # 未連接資料庫時的範例文章
│   └── format.ts      # 日期格式化
├── styles/
└── types/
```

## 新增語言

1. 在 `src/types/index.ts` 的 `Language` 型別加入語言代碼
2. 在 `src/i18n/index.tsx` 的 `translations` 補上該語言字典，並在 `languageNames` 加入顯示名稱
