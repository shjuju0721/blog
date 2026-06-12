import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed, safeNext } from "@/lib/auth";
import { login } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = safeNext(sp.next);

  // 이미 로그인했으면 바로 돌려보냄
  if (await isAuthed()) redirect(next);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-2 text-2xl font-bold">관리자 로그인</h1>
      <p className="mb-6 text-sm text-gray-500">
        글쓰기·수정·삭제를 하려면 패스코드를 입력하세요. 글 읽기는 누구나 가능합니다.
      </p>

      <form action={login} className="space-y-4">
        <div>
          <label htmlFor="passcode" className="mb-1 block text-sm font-medium">
            패스코드
          </label>
          <input
            id="passcode"
            name="passcode"
            type="password"
            inputMode="numeric"
            autoFocus
            required
            placeholder="패스코드를 입력하세요"
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>

        {sp.error && (
          <p className="text-sm text-red-600">패스코드가 올바르지 않습니다.</p>
        )}

        <input type="hidden" name="next" value={next} />

        <button
          type="submit"
          className="w-full rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          확인
        </button>
      </form>
    </div>
  );
}
