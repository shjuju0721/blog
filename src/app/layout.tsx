import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { UNCATEGORIZED } from "@/lib/categories";

export const dynamic = "force-dynamic";

const SITE_NAME = "신현주 월드";
const SITE_DESCRIPTION =
  "신현주가 기록하는 생각과 일상, 테크·경제·과학 이야기를 담은 개인 블로그 — 신현주 월드";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "신현주",
    "신현주 월드",
    "신현주월드",
    "블로그",
    "개인 블로그",
    "테크",
    "기록",
  ],
  authors: [{ name: "신현주" }],
  creator: "신현주",
  publisher: "신현주",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// 카테고리별 글 개수 집계 (사이드바용)
async function getCategoryCounts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("posts").select("category");
    if (error || !data) return { counts: {}, total: 0 };

    const counts: Record<string, number> = {};
    for (const row of data as { category: string | null }[]) {
      const key = row.category ?? UNCATEGORIZED;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return { counts, total: data.length };
  } catch {
    // category 컬럼이 아직 없거나 연결 실패 시 빈 집계
    return { counts: {}, total: 0 };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { counts, total } = await getCategoryCounts();

  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold">
              신현주 월드
            </Link>
            <nav>
              <Link
                href="/posts/new"
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                글쓰기
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:flex-row">
          <Sidebar counts={counts} total={total} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
