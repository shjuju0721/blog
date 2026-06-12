import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm";
import { isAuthed } from "@/lib/auth";
import { createPost } from "../actions";

export default async function NewPostPage() {
  if (!(await isAuthed())) redirect("/login?next=/posts/new");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">새 글 작성</h1>
      <PostForm action={createPost} submitLabel="작성" cancelHref="/" />
    </div>
  );
}
