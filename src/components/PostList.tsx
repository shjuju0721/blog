import Link from "next/link";
import type { Post } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 목록 미리보기용: HTML 태그/마크다운 기호를 걷어내 순수 텍스트만 표시
function toPlainText(content: string) {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*`~>_]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-500">아직 작성된 글이 없습니다.</p>
        <Link
          href="/posts/new"
          className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          첫 글 작성하기
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-lg border border-gray-200 bg-white p-5 transition hover:shadow-sm"
        >
          <Link href={`/posts/${post.id}`} className="flex gap-4">
            {post.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-24 w-24 shrink-0 rounded-md border border-gray-200 object-cover sm:h-28 sm:w-40"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {post.category && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {post.category}
                  </span>
                )}
                <time className="text-xs text-gray-400">
                  {formatDate(post.created_at)}
                </time>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-gray-900">
                {post.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {toPlainText(post.content)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
