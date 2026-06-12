import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import ImageUpload from "@/components/ImageUpload";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    title?: string;
    content?: string;
    category?: string | null;
    cover_image?: string | null;
  };
  submitLabel: string;
  cancelHref: string;
};

// 작성/수정 공용 폼 (서버 액션을 action 으로 받습니다)
export default function PostForm({
  action,
  defaultValues,
  submitLabel,
  cancelHref,
}: Props) {
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title ?? ""}
          placeholder="제목을 입력하세요"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          카테고리
        </label>
        <select
          id="category"
          name="category"
          defaultValue={defaultValues?.category ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        >
          <option value="">선택 안 함</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <ImageUpload defaultUrl={defaultValues?.cover_image} />

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          rows={14}
          defaultValue={defaultValues?.content ?? ""}
          placeholder="내용을 입력하세요"
          className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
