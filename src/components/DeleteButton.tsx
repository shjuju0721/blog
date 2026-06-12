"use client";

// 삭제 확인 후 폼을 제출하는 버튼 (부모의 <form action={deletePost}> 안에서 사용)
export default function DeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("정말 이 글을 삭제할까요?")) {
          e.preventDefault();
        }
      }}
      className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      삭제
    </button>
  );
}
