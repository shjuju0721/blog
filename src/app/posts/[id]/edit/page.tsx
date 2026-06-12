import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostForm from "@/components/PostForm";
import { updatePost } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
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
    <div>
      <h1 className="mb-6 text-2xl font-bold">글 수정</h1>
      <PostForm
        action={updatePost.bind(null, post.id)}
        defaultValues={{
          title: post.title,
          content: post.content,
          category: post.category,
          cover_image: post.cover_image,
        }}
        submitLabel="수정"
        cancelHref={`/posts/${post.id}`}
      />
    </div>
  );
}
