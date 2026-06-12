import { ImageResponse } from "next/og";

// 검색/SNS 공유 시 노출되는 대표 이미지(블로그명 포함)를 동적으로 생성합니다.
export const alt = "신현주 월드 — 개인 블로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og(satori)는 한글 글리프가 없는 기본 폰트를 쓰므로,
// 표시할 글자만 담은 Noto Sans KR 서브셋을 구글 폰트에서 받아옵니다.
async function loadKoreanFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(
      text
    )}`;
    const css = await (await fetch(url)).text();
    const m = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!m) return null;
    const res = await fetch(m[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const title = "신현주 월드";
  const subtitle = "생각과 일상의 기록";
  const font = await loadKoreanFont(title + subtitle);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 40,
            fontWeight: 700,
            color: "#94a3b8",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Noto Sans KR", data: font, style: "normal", weight: 700 }]
        : undefined,
    }
  );
}
