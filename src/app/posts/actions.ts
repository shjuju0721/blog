"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAuthed } from "@/lib/auth";

// 글 작성
export async function createPost(formData: FormData) {
  if (!(await isAuthed())) redirect("/login?next=/posts/new");

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const category = String(formData.get("category") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim() || null;

  if (!title) {
    throw new Error("제목을 입력하세요.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, category, cover_image })
    .select("id")
    .single();

  if (error) {
    throw new Error(`작성 실패: ${error.message}`);
  }

  revalidatePath("/");
  redirect(`/posts/${data.id}`);
}

// 글 수정
export async function updatePost(id: string, formData: FormData) {
  if (!(await isAuthed())) redirect(`/login?next=/posts/${id}/edit`);

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const category = String(formData.get("category") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim() || null;

  if (!title) {
    throw new Error("제목을 입력하세요.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ title, content, category, cover_image })
    .eq("id", id);

  if (error) {
    throw new Error(`수정 실패: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}

// 글 삭제
export async function deletePost(id: string) {
  if (!(await isAuthed())) redirect(`/login?next=/posts/${id}`);

  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(`삭제 실패: ${error.message}`);
  }

  revalidatePath("/");
  redirect("/");
}
