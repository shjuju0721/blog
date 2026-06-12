import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import DeleteButton from "@/components/DeleteButton";
import Markdown from "@/components/Markdown";
import { deletePost } from "../actions";

export const dynamic = "force-dynamic";

// 본문에서 마크다운 기호를 걷어내 검색/공유용 요약을 만듭니다.
function toSummary(content: string) {
  return (
    content
      .replace(/[#>*`_~\-\[\]()!]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120) || "신현주 월드의 글"
  );
}

// 글별 메타태그 — 제목/요약/대표 이미지가 검색·SNS 카드에 반영됩니다.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("title, content, cover_image")
    .eq("id", id)
    .single();

  if (!data) return { title: "글을 찾을 수 없습니다" };

  const post = data as Pick<Post, "title" | "content" | "cover_image">;
  const description = toSummary(post.content);
  const images = post.cover_image ? [post.cover_image] : undefined;

  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const post = data as Post;

  return (
    <article>
      <div className="mb-2 text-sm">
        <Link href="/" className="text-gray-500 hover:underline">
          ← 목록으로
        </Link>
      </div>

      {post.category && (
        <Link
          href={`/category/${encodeURIComponent(post.category)}`}
          className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
        >
          {post.category}
        </Link>
      )}
      <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
      <div className="mt-2 text-sm text-gray-400">
        작성 {formatDate(post.created_at)}
        {post.updated_at !== post.created_at && (
          <> · 수정 {formatDate(post.updated_at)}</>
        )}
      </div>

      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image}
          alt={post.title}
          className="mt-6 max-h-[28rem] w-full rounded-lg border border-gray-200 object-cover"
        />
      )}

      <div className="mt-6">
        <Markdown>{post.content}</Markdown>
      </div>

      <div className="mt-10 flex items-center gap-2 border-t border-gray-200 pt-6">
        <Link
          href={`/posts/${post.id}/edit`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          수정
        </Link>
        <form action={deletePost.bind(null, post.id)}>
          <DeleteButton />
        </form>
      </div>
    </article>
  );
}
