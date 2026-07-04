-- 在 Supabase Dashboard → SQL Editor 執行本檔案
-- 文章資料表：建立/更新時間自動記錄

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null default '',
  lang text not null default 'zh',
  tags text[] not null default '{}',
  excerpt text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 舊版資料表補欄位（新建立的資料表已包含，重複執行無害）
alter table public.posts add column if not exists tags text[] not null default '{}';
alter table public.posts add column if not exists excerpt text;

-- 更新時自動刷新 updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Row Level Security：
--   匿名訪客只能讀取已發布文章；登入使用者（編輯者）可完整讀寫
alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select
  using (published = true);

drop policy if exists "Authenticated users can read all posts" on public.posts;
create policy "Authenticated users can read all posts"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert posts" on public.posts;
create policy "Authenticated users can insert posts"
  on public.posts for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update posts" on public.posts;
create policy "Authenticated users can update posts"
  on public.posts for update
  to authenticated
  using (true);

drop policy if exists "Authenticated users can delete posts" on public.posts;
create policy "Authenticated users can delete posts"
  on public.posts for delete
  to authenticated
  using (true);

-- 搜尋效能（關鍵字搜尋標題與內容）
create index if not exists posts_title_content_idx
  on public.posts using gin (to_tsvector('simple', title || ' ' || content));
