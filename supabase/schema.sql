-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.

-- 1) posts 테이블
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 기존에 테이블이 있었다면 category 컬럼만 추가
alter table public.posts add column if not exists category text;

-- 2) updated_at 자동 갱신 트리거
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

-- 3) Row Level Security
alter table public.posts enable row level security;

-- ⚠️ 1차(로그인 구현 전): 모든 작업을 공개 허용합니다.
--    로그인 기능을 추가할 때 아래 정책을 인증 기반으로 교체하세요.
drop policy if exists "posts public select" on public.posts;
create policy "posts public select" on public.posts
  for select using (true);

drop policy if exists "posts public insert" on public.posts;
create policy "posts public insert" on public.posts
  for insert with check (true);

drop policy if exists "posts public update" on public.posts;
create policy "posts public update" on public.posts
  for update using (true) with check (true);

drop policy if exists "posts public delete" on public.posts;
create policy "posts public delete" on public.posts
  for delete using (true);
