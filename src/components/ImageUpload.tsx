"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "post-images";

// 대표 이미지를 Supabase Storage(OSS)에 업로드하고,
// 공개 URL을 hidden input(cover_image)에 담아 폼과 함께 전송합니다.
export default function ImageUpload({
  defaultUrl,
}: {
  defaultUrl?: string | null;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "png";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이미지 업로드에 실패했습니다."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">대표 이미지</label>
      <p className="mb-2 text-xs text-gray-400">
        검색·공유 카드와 글 상단에 표시됩니다. (선택)
      </p>

      {url && (
        // 미리보기 — Storage 도메인 설정 없이 동작하도록 일반 img 사용
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="대표 이미지 미리보기"
          className="mb-3 max-h-56 w-full rounded-md border border-gray-200 object-cover"
        />
      )}

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={uploading}
          className="block text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-700 disabled:opacity-50"
        />
        {uploading && <span className="text-sm text-gray-500">업로드 중…</span>}
        {url && !uploading && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            제거
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* 서버 액션으로 전달되는 실제 값 */}
      <input type="hidden" name="cover_image" value={url} />
    </div>
  );
}
