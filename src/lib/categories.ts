// 블로그 글 분야(카테고리) 목록
export const CATEGORIES = [
  "테크",
  "경제",
  "국제",
  "한국",
  "과학",
  "스포츠",
  "게임",
  "환경",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const UNCATEGORIZED = "기타";
