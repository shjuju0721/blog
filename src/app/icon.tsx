import { ImageResponse } from "next/og";

// 브라우저 탭 / 검색결과에 표시되는 파비콘 (브랜드 아이콘)
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 700,
          color: "#ffffff",
          background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
          borderRadius: 7,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
