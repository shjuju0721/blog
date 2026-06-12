import PostForm from "@/components/PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">새 글 작성</h1>
      <PostForm action={createPost} submitLabel="작성" cancelHref="/" />
    </div>
  );
}
