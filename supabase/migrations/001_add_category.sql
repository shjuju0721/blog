-- 카테고리(분야) 기능 추가 마이그레이션
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 한 번 실행하세요.

-- 1) category 컬럼 추가
alter table public.posts add column if not exists category text;

-- 2) 기존 10개 글에 분야 지정
update public.posts set category = '테크'   where title = 'AI 빅뱅: Claude Opus 4.8 공개와 Anthropic의 965조 몸값';
update public.posts set category = '국제'   where title = '이스라엘-이란 충돌 격화… 중동 긴장 최고조';
update public.posts set category = '과학'   where title = '제임스 웹, ''블랙홀 별'' 가장 강력한 증거 포착';
update public.posts set category = '경제'   where title = '세계 경제, 중동發 충격에 코로나 이후 최저 성장 전망';
update public.posts set category = '스포츠' where title = '2026 북중미 월드컵 개막! 48개국 시대 열렸다';
update public.posts set category = '한국'   where title = '코스피, 세계 최고 수익률… 반도체 수출이 이끈다';
update public.posts set category = '과학'   where title = '의학의 돌파구: 췌장암 신약부터 AI 설계 백신까지';
update public.posts set category = '환경'   where title = '세계 환경의 날 2026: 1.5도 한계선 무너지나';
update public.posts set category = '게임'   where title = '여름 게임 페스트 2026 결산: 킹덤하츠 IV부터 에일리언까지';
update public.posts set category = '테크'   where title = '빅테크 AI 인프라 투자 경쟁과 미·중 갈등 격화';
