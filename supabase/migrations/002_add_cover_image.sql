-- 대표 이미지(OSS) 기능 추가 마이그레이션
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.

-- 1) posts 에 cover_image 컬럼 추가 (대표 이미지 공개 URL 저장)
alter table public.posts add column if not exists cover_image text;

-- 2) 이미지 저장용 Storage 버킷(OSS) 생성 — 공개 읽기
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- 3) 버킷 접근 정책
--    ⚠️ 1차(로그인 전): 업로드/삭제를 공개 허용합니다.
--       로그인 기능 추가 시 auth.role() = 'authenticated' 등으로 교체하세요.
drop policy if exists "post-images public read" on storage.objects;
create policy "post-images public read" on storage.objects
  for select using (bucket_id = 'post-images');

drop policy if exists "post-images public insert" on storage.objects;
create policy "post-images public insert" on storage.objects
  for insert with check (bucket_id = 'post-images');

drop policy if exists "post-images public delete" on storage.objects;
create policy "post-images public delete" on storage.objects
  for delete using (bucket_id = 'post-images');
