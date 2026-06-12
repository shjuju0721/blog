# 내 블로그 (Next.js + Supabase)

개인 블로그 사이트입니다. 글 작성/조회/수정/삭제(CRUD)를 지원합니다.
로그인 기능은 1차 완성 후 추가할 예정입니다.

## 기술 스택

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)

## 처음 한 번만 설정하기

### 1. Supabase 프로젝트 만들기

1. https://supabase.com 가입 후 **New project** 생성
2. 프로젝트가 만들어지면 좌측 **SQL Editor** 로 이동
3. 이 저장소의 `supabase/schema.sql` 내용을 붙여넣고 **Run** 실행
   → `posts` 테이블과 보안 정책이 생성됩니다.

### 2. 환경 변수 설정

1. Supabase 대시보드 > **Project Settings > API** 이동
2. `.env.local.example` 을 복사해 `.env.local` 파일을 만들고 값 입력:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon / public key

## 실행

```bash
npm install      # 최초 1회 (또는 의존성 변경 시)
npm run dev      # 개발 서버 실행 → http://localhost:3000
```

## 폴더 구조

```
src/
  app/
    layout.tsx              # 공통 레이아웃 (헤더/네비)
    page.tsx               # 글 목록 (Read)
    posts/
      actions.ts           # 서버 액션: createPost / updatePost / deletePost
      new/page.tsx         # 글 작성 (Create)
      [id]/page.tsx        # 글 상세 (Read) + 삭제 버튼
      [id]/edit/page.tsx   # 글 수정 (Update)
  components/
    PostForm.tsx           # 작성/수정 공용 폼
    DeleteButton.tsx       # 삭제 확인 버튼
  lib/
    supabase/client.ts     # 브라우저용 Supabase 클라이언트
    supabase/server.ts     # 서버용 Supabase 클라이언트
    types.ts               # Post 타입
supabase/schema.sql        # DB 스키마 + 보안 정책
```

## 로그인 추가 시 (다음 단계)

`supabase/schema.sql` 의 RLS 정책은 현재 **모두 공개 허용** 상태입니다.
로그인을 붙일 때 insert/update/delete 정책을 `auth.uid()` 기반으로 교체하고,
`posts` 에 `author_id` 컬럼을 추가하면 됩니다.
