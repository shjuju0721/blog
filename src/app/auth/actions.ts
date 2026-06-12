"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  AUTH_TOKEN,
  verifyPasscode,
  safeNext,
} from "@/lib/auth";

// 패스코드 로그인: 맞으면 인증 쿠키를 발급하고 원래 가려던 페이지로 이동
export async function login(formData: FormData) {
  const passcode = String(formData.get("passcode") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/"));

  if (!verifyPasscode(passcode)) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  store.set(AUTH_COOKIE, AUTH_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7일
  });

  redirect(next);
}

// 로그아웃: 인증 쿠키 삭제
export async function logout() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  redirect("/");
}
