import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostList from "@/components/PostList";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const category = decodeURIComponent(name);

  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="font-medium">글을 불러오지 못했습니다.</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <p className="mt-2 text-sm text-red-600">
          posts 테이블에 category 컬럼이 있는지 확인하세요. (migrations 안내 참고)
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">
        <span className="text-gray-400">카테고리 ·</span> {category}
      </h1>
      <PostList posts={(posts ?? []) as Post[]} />
    </div>
  );
}
