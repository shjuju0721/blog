// 기존 글에 category 를 채웁니다. (posts 에 category 컬럼이 이미 있어야 함)
// 실행: node scripts/set-categories.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 제목에 포함된 키워드 → 카테고리
const RULES = [
  ["Claude Opus", "테크"],
  ["빅테크 AI 인프라", "테크"],
  ["이스라엘-이란", "국제"],
  ["블랙홀", "과학"],
  ["의학의 돌파구", "과학"],
  ["세계 경제", "경제"],
  ["월드컵", "스포츠"],
  ["코스피", "한국"],
  ["환경의 날", "환경"],
  ["게임 페스트", "게임"],
];

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

const res = await fetch(`${URL}/rest/v1/posts?select=id,title,category`, { headers });
if (!res.ok) {
  console.error(`목록 조회 실패: ${res.status} ${await res.text()}`);
  console.error("→ posts 에 category 컬럼이 있는지(마이그레이션 실행 여부) 확인하세요.");
  process.exit(1);
}
const posts = await res.json();

let updated = 0;
for (const p of posts) {
  const rule = RULES.find(([kw]) => p.title.includes(kw));
  if (!rule) {
    console.log(`· 규칙 없음(건너뜀): ${p.title}`);
    continue;
  }
  const category = rule[1];
  if (p.category === category) continue;
  const r = await fetch(`${URL}/rest/v1/posts?id=eq.${p.id}`, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({ category }),
  });
  if (r.ok) {
    updated++;
    console.log(`✓ [${category}] ${p.title}`);
  } else {
    console.error(`✗ 실패: ${p.title} — ${r.status} ${await r.text()}`);
  }
}
console.log(`\n완료: ${updated} 개 업데이트`);
