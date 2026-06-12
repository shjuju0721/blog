# 신현주 월드 (Shin Hyunju World)

**Next.js + Supabase** 로 만든 개인 블로그 사이트 **신현주 월드** 입니다.
글을 **마크다운**으로 작성하고, **분야(카테고리)별**로 분류해 보여줍니다.
**대표 이미지(OSS 업로드)** 와 **SEO 메타태그 / OG 이미지** 로 검색·공유에 최적화되어 있습니다.

> 현재는 로그인 없이 누구나 글을 쓰고 고칠 수 있는 **1차 버전**입니다.
> 인증(로그인) 기능은 다음 단계에서 추가할 예정입니다. ([로드맵](#-로드맵) 참고)

---

## ✨ 주요 기능

| 기능 | 설명 |
| --- | --- |
| **글 CRUD** | 작성 · 목록 · 상세 · 수정 · 삭제 (Next.js 서버 액션 기반) |
| **마크다운 렌더링** | 제목/목록/표/인용/링크 등을 예쁘게 표시 (GitHub Flavored Markdown 지원) |
| **카테고리 분류** | 좌측 사이드바에서 분야별 글 개수 표시 + 클릭 시 해당 분야만 필터링 |
| **분야 뱃지** | 목록·상세 페이지에 카테고리 뱃지 표시 (클릭 시 같은 분야 목록으로 이동) |
| **대표 이미지 (OSS)** | Supabase Storage 버킷에 이미지를 업로드해 목록 썸네일·상세 상단·공유 카드에 표시 |
| **SEO / 메타태그** | Open Graph·Twitter 카드, `robots.txt`, `sitemap.xml`, 글별 메타태그로 검색 노출 |
| **OG 이미지 자동 생성** | `next/og` 로 "신현주 월드" 브랜드 이미지를 동적 생성 → 검색·SNS 카드에 표시 |

기본 카테고리: `테크 · 경제 · 국제 · 한국 · 과학 · 스포츠 · 게임 · 환경`
(분야는 `src/lib/categories.ts` 배열만 수정하면 사이드바·작성 폼에 자동 반영됩니다.)

---

## 🛠 기술 스택

- **[Next.js 15](https://nextjs.org/)** (App Router) + **TypeScript**
- **React 19**
- **[Tailwind CSS v4](https://tailwindcss.com/)** + `@tailwindcss/typography`
- **[Supabase](https://supabase.com/)** (PostgreSQL + 자동 생성 REST API + **Storage / OSS**)
- **[react-markdown](https://github.com/remarkjs/react-markdown)** + `remark-gfm` (마크다운 렌더링)
- **`next/og`** (OG 이미지 동적 생성) + Next.js Metadata API (SEO)

---

## 🚀 처음 시작하기 (Getting Started)

### 0. 사전 준비

- **Node.js 18 이상** ([nodejs.org](https://nodejs.org) LTS 권장)
- **Supabase 계정** (무료)

### 1. 저장소 클론 & 의존성 설치

```bash
git clone https://github.com/shjuju0721/blog.git
cd blog
npm install
```

### 2. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 가입 후 **New project** 생성
2. 좌측 **SQL Editor** 로 이동
3. 이 저장소의 `supabase/schema.sql` 내용을 붙여넣고 **Run** 실행
   → `posts` 테이블(`category`·`cover_image` 컬럼 포함), `updated_at` 자동 갱신 트리거,
   보안 정책(RLS), **이미지 저장용 Storage 버킷(`post-images`, OSS)** 과 정책이 생성됩니다.

### 3. 환경 변수 설정

1. Supabase 대시보드 → **Project Settings → API** 이동
2. 프로젝트 루트에 `.env.local` 파일을 만들고 값을 채웁니다
   (`.env.local.example` 을 복사하면 편합니다):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon(publishable)_키
# 배포 도메인 (메타태그/OG 이미지/사이트맵의 절대 URL 용, 선택)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

| 변수 | 위치 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → **anon / publishable key** |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 (없으면 `http://localhost:3000`). OG/검색 메타태그의 절대 URL 생성에 사용 |

> ⚠️ `.env.local` 은 `.gitignore` 에 등록되어 Git 에 올라가지 않습니다.
> `anon`(publishable) 키는 브라우저에 노출되도록 설계된 공개 키이므로 클라이언트에서 사용해도 안전합니다. (절대 노출되면 안 되는 `service_role` 키는 사용하지 않습니다.)

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 **http://localhost:3000** 접속 → 끝! 🎉

---

## 📜 npm 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드된 결과물 실행 |
| `npm run lint` | 코드 린트 검사 |

---

## 📂 프로젝트 구조

```
blog/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                 # 공통 레이아웃 + 사이트 메타데이터(SEO/OG)
│  │  ├─ page.tsx                   # 전체 글 목록 (Read)
│  │  ├─ opengraph-image.tsx        # "신현주 월드" OG 이미지 동적 생성
│  │  ├─ icon.tsx                   # 파비콘(브랜드 아이콘) 생성
│  │  ├─ robots.ts                  # 검색엔진 크롤링 규칙
│  │  ├─ sitemap.ts                 # 사이트맵(글/카테고리 자동 수집)
│  │  ├─ globals.css                # Tailwind + typography 설정
│  │  ├─ category/
│  │  │  └─ [name]/page.tsx         # 분야별 글 목록
│  │  └─ posts/
│  │     ├─ actions.ts              # 서버 액션: createPost / updatePost / deletePost
│  │     ├─ new/page.tsx            # 글 작성 (Create)
│  │     ├─ [id]/page.tsx           # 글 상세 (Read) + 수정/삭제 버튼
│  │     └─ [id]/edit/page.tsx      # 글 수정 (Update)
│  ├─ components/
│  │  ├─ Sidebar.tsx                # 좌측 카테고리 네비게이션 (클라이언트)
│  │  ├─ PostList.tsx               # 글 목록 카드 (목록/분야 페이지 공용)
│  │  ├─ PostForm.tsx               # 작성/수정 공용 폼 (카테고리·대표 이미지 포함)
│  │  ├─ ImageUpload.tsx            # 대표 이미지 → Supabase Storage(OSS) 업로드 (클라이언트)
│  │  ├─ DeleteButton.tsx           # 삭제 확인 버튼 (클라이언트)
│  │  └─ Markdown.tsx               # 마크다운 → HTML 렌더링
│  └─ lib/
│     ├─ categories.ts              # 카테고리 목록 정의
│     ├─ types.ts                   # Post 타입
│     └─ supabase/
│        ├─ client.ts               # 브라우저용 Supabase 클라이언트
│        └─ server.ts               # 서버용 Supabase 클라이언트
├─ supabase/
│  ├─ schema.sql                    # 전체 DB 스키마 + RLS + Storage 버킷 (신규 설치용)
│  └─ migrations/
│     ├─ 001_add_category.sql       # category 컬럼 추가 마이그레이션
│     └─ 002_add_cover_image.sql    # cover_image 컬럼 + Storage 버킷(OSS) 마이그레이션
├─ scripts/
│  ├─ seed.mjs                      # 샘플 글 10개 삽입
│  └─ set-categories.mjs            # 기존 글에 카테고리 일괄 지정
├─ .env.local.example               # 환경 변수 예시
└─ package.json
```

---

## 🗄 데이터베이스 스키마

`posts` 테이블:

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `uuid` | 기본키 (자동 생성) |
| `title` | `text` | 제목 (필수) |
| `content` | `text` | 본문 (마크다운) |
| `category` | `text` | 분야 (없으면 `null`) |
| `cover_image` | `text` | 대표 이미지 공개 URL (Storage/OSS, 없으면 `null`) |
| `created_at` | `timestamptz` | 작성 시각 (자동) |
| `updated_at` | `timestamptz` | 수정 시각 (트리거로 자동 갱신) |

**보안(RLS):** 현재는 1차 버전이라 `select / insert / update / delete` 모두 **공개 허용** 상태입니다. 로그인 기능 추가 시 인증 기반으로 교체합니다.

---

## 🌱 샘플 데이터 넣기 (선택)

빈 블로그에 예시 글 10개를 채우고 싶다면:

```bash
node scripts/seed.mjs              # 마크다운 글 10개 삽입
```

> `scripts/seed.mjs` 를 다시 실행하면 같은 글이 중복 생성되니 주의하세요.

이미 글은 있는데 카테고리만 다시 맞추고 싶다면
(`posts` 에 `category` 컬럼이 있어야 함):

```bash
node scripts/set-categories.mjs    # 제목 키워드로 분야 일괄 지정
```

---

## 🔄 마이그레이션 안내

이미 운영 중인 DB를 업데이트하려면, 아래 마이그레이션을 Supabase **SQL Editor** 에서 한 번씩 실행하세요.

- `supabase/migrations/001_add_category.sql` — `category` 컬럼 추가
- `supabase/migrations/002_add_cover_image.sql` — `cover_image` 컬럼 + 이미지 Storage 버킷(OSS) 생성

(신규로 `schema.sql` 을 실행하는 경우엔 이미 모두 포함되어 있어 별도 작업이 필요 없습니다.)

---

## ☁️ 배포 (선택)

[Vercel](https://vercel.com) 에 배포하는 것을 권장합니다.

1. Vercel 에서 이 GitHub 저장소를 Import
2. **Environment Variables** 에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가
3. Deploy

---

## 🗺 로드맵

- [x] 블로그 글 CRUD
- [x] 마크다운 렌더링
- [x] 카테고리 분류 + 좌측 사이드바
- [x] 이미지 업로드 (Supabase Storage / OSS)
- [x] SEO 메타태그 + OG 이미지 자동 생성 + sitemap / robots
- [ ] **로그인 / 인증** (Supabase Auth)
  - 작성·수정·삭제를 로그인한 사용자로 제한
  - `posts` 에 `author_id` 추가 후 RLS 정책을 `auth.uid()` 기반으로 교체
  - Storage 정책도 인증 기반으로 교체
- [ ] 댓글 기능

---

## 📄 라이선스

개인 학습/취미용 프로젝트입니다.
