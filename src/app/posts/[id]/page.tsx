import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import DeleteButton from "@/components/DeleteButton";
import Markdown from "@/components/Markdown";
import { deletePost } from "../actions";

export const dynamic = "force-dynamic";

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
