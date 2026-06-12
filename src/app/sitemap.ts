import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/categories";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

// 검색엔진이 블로그의 모든 글/카테고리를 찾을 수 있도록 사이트맵을 생성합니다.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(c)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, updated_at")
      .order("created_at", { ascending: false });

    const posts: MetadataRoute.Sitemap = (data ?? []).map(
      (p: { id: string; updated_at: string }) => ({
        url: `${SITE_URL}/posts/${p.id}`,
        lastModified: p.updated_at,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    );

    return [...base, ...posts];
  } catch {
    return base;
  }
}
