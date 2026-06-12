import { cookies } from "next/headers";

// 패스코드 기반 간단 접근 제어.
// 패스코드는 서버 전용 env(BLOG_PASSCODE)로 관리하며, 미설정 시 기본값 사용.
// NEXT_PUBLIC_ 접두사가 없으므로 클라이언트 번들에 노출되지 않습니다.
export const AUTH_COOKIE = "blog_auth";
export const AUTH_TOKEN = "granted";
export const PASSCODE = process.env.BLOG_PASSCODE || "112233";

// 현재 요청이 인증(패스코드 통과)된 상태인지 확인
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value === AUTH_TOKEN;
}

// 입력 패스코드 검증
export function verifyPasscode(input: string): boolean {
  return input.trim() === PASSCODE;
}

// 오픈 리다이렉트 방지를 위한 안전한 내부 경로만 허용
export function safeNext(next: string | undefined | null): string {
  if (!next) return "/";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
