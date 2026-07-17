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
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 舊版資料表補欄位（新建立的資料表已包含，重複執行無害）
alter table public.posts add column if not exists tags text[] not null default '{}';
alter table public.posts add column if not exists excerpt text;
alter table public.posts add column if not exists views integer not null default 0;

-- 更新時自動刷新 updated_at（僅瀏覽數累加不算內容更新，不刷新）
create or replace function public.set_updated_at()
returns trigger as $$
begin
  if (to_jsonb(new) - 'views' - 'updated_at') is distinct from (to_jsonb(old) - 'views' - 'updated_at') then
    new.updated_at = now();
  end if;
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

-- 瀏覽數累計：匿名訪客沒有 update 權限，改由 security definer function 累加，
-- 且只允許 +1 已發布文章，避免被用來竄改其他欄位
create or replace function public.increment_post_views(post_slug text)
returns void as $$
begin
  update public.posts
  set views = views + 1
  where slug = post_slug and published = true;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.increment_post_views(text) to anon, authenticated;

-- 搜尋效能（關鍵字搜尋標題與內容）
create index if not exists posts_title_content_idx
  on public.posts using gin (to_tsvector('simple', title || ' ' || content));

-- ============================================================
-- 編輯器檔案上傳（圖片／影片）：公開讀取的 media bucket，僅登入使用者可上傳
-- 只允許 jpg / jpeg / png / mp4 / mov（由 bucket 的 allowed_mime_types 在伺服器端強制）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800, -- 50 MB
  array['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- storage.objects 的 policy 在部分專案無法由 SQL Editor 建立（must be owner of table objects）。
-- 包在例外處理中，避免整份 schema 執行失敗回滾、連 bucket 都沒建立。
-- 若看到下方的 NOTICE，請改用 Dashboard 建立 policy：
--   Storage → Policies → media bucket → New policy →
--   允許 authenticated 角色 INSERT（及 DELETE），target: objects，無額外條件即可。
do $$
begin
  drop policy if exists "Authenticated users can upload media" on storage.objects;
  create policy "Authenticated users can upload media"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'media');

  drop policy if exists "Authenticated users can delete media" on storage.objects;
  create policy "Authenticated users can delete media"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'media');
exception when insufficient_privilege then
  raise notice 'Could not create storage policies via SQL. Create them in Dashboard: Storage -> Policies -> media -> allow INSERT/DELETE for authenticated.';
end $$;
