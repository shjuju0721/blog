"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Markdown from "@/components/Markdown";

type Props = {
  name: string;
  defaultValue?: string;
};

// 자주 쓰는 이모지
const EMOJIS = [
  "😀", "😂", "🥰", "😎", "🤔", "😢", "😡", "👍", "👎", "👏",
  "🙏", "💪", "🔥", "✨", "🎉", "❤️", "💜", "💯", "✅", "❌",
  "⭐", "⚡", "🚀", "📌", "📝", "💡", "⚠️", "🎯", "🍀", "☕",
];

// 글자 색 프리셋
const COLORS = [
  "#e11d48", "#ea580c", "#ca8a04", "#16a34a",
  "#0891b2", "#2563eb", "#7c3aed", "#111827",
];

export default function MarkdownEditor({ name, defaultValue }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [showEmoji, setShowEmoji] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const pendingSel = useRef<[number, number] | null>(null);

  // setValue 이후 커서/선택 영역 복원
  useLayoutEffect(() => {
    if (pendingSel.current && ref.current) {
      const [s, e] = pendingSel.current;
      ref.current.focus();
      ref.current.setSelectionRange(s, e);
      pendingSel.current = null;
    }
  }, [value]);

  function getSel() {
    const el = ref.current;
    if (!el) return { start: value.length, end: value.length };
    return { start: el.selectionStart, end: el.selectionEnd };
  }

  // 선택 영역을 before/after 로 감싸기 (인라인 서식)
  function wrap(before: string, after: string, placeholder = "내용") {
    const { start, end } = getSel();
    const sel = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + sel + after + value.slice(end);
    const s = start + before.length;
    pendingSel.current = [s, s + sel.length];
    setValue(next);
  }

  // 커서 위치에 텍스트 삽입
  function insert(text: string) {
    const { start, end } = getSel();
    const next = value.slice(0, start) + text + value.slice(end);
    const pos = start + text.length;
    pendingSel.current = [pos, pos];
    setValue(next);
  }

  // 선택된 줄들 앞에 기호 붙이기 (목록/인용/제목)
  function prefixLines(make: (line: string, i: number) => string) {
    const { start, end } = getSel();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const nl = value.indexOf("\n", end);
    const blockEnd = nl === -1 ? value.length : nl;
    const block = value.slice(lineStart, blockEnd) || "내용";
    const out = block.split("\n").map(make).join("\n");
    const next = value.slice(0, lineStart) + out + value.slice(blockEnd);
    pendingSel.current = [lineStart, lineStart + out.length];
    setValue(next);
  }

  // 선택 영역을 블록(div)으로 감싸기 (정렬/줄간격)
  function wrapBlock(style: string, placeholder = "내용") {
    const { start, end } = getSel();
    const sel = value.slice(start, end) || placeholder;
    const block = `<div style="${style}">\n\n${sel}\n\n</div>\n`;
    const next = value.slice(0, start) + block + value.slice(end);
    const pos = start + block.length;
    pendingSel.current = [pos, pos];
    setValue(next);
  }

  return (
    <div className="rounded-md border border-gray-300">
      {/* 탭 */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-2 pt-2">
        <TabBtn active={tab === "write"} onClick={() => setTab("write")}>
          작성
        </TabBtn>
        <TabBtn active={tab === "preview"} onClick={() => setTab("preview")}>
          미리보기
        </TabBtn>
      </div>

      {tab === "write" && (
        <>
          {/* 툴바 */}
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2">
            <Btn title="굵게" onClick={() => wrap("**", "**")}>
              <b>B</b>
            </Btn>
            <Btn title="기울임" onClick={() => wrap("*", "*")}>
              <i>I</i>
            </Btn>
            <Btn title="취소선" onClick={() => wrap("~~", "~~")}>
              <s>S</s>
            </Btn>
            <Btn title="형광펜" onClick={() => wrap("<mark>", "</mark>")}>
              <mark className="px-0.5">H</mark>
            </Btn>

            <Sep />

            {/* 글자 크기 */}
            <select
              title="글자 크기"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value)
                  wrap(`<span style="font-size:${e.target.value}">`, "</span>");
                e.target.value = "";
              }}
              className="rounded border border-gray-300 px-1.5 py-1 text-sm"
            >
              <option value="">크기</option>
              <option value="0.85em">작게</option>
              <option value="1.25em">크게</option>
              <option value="1.6em">더 크게</option>
              <option value="2em">아주 크게</option>
            </select>

            {/* 글자 색 */}
            <div className="flex items-center gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={`색상 ${c}`}
                  onClick={() => wrap(`<span style="color:${c}">`, "</span>")}
                  className="h-6 w-6 rounded border border-gray-300"
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                title="사용자 지정 색"
                onChange={(e) => setColor(e.target.value)}
                className="h-6 w-6 cursor-pointer border border-gray-300 p-0"
              />
              <Btn
                title="선택 색 적용"
                onClick={() => wrap(`<span style="color:${color}">`, "</span>")}
              >
                적용
              </Btn>
            </div>

            <Sep />

            {/* 정렬 */}
            <Btn title="왼쪽 정렬" onClick={() => wrapBlock("text-align:left")}>
              ⬅
            </Btn>
            <Btn title="가운데 정렬" onClick={() => wrapBlock("text-align:center")}>
              ⬌
            </Btn>
            <Btn title="오른쪽 정렬" onClick={() => wrapBlock("text-align:right")}>
              ➡
            </Btn>

            {/* 줄 간격 */}
            <select
              title="줄 간격"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) wrapBlock(`line-height:${e.target.value}`);
                e.target.value = "";
              }}
              className="rounded border border-gray-300 px-1.5 py-1 text-sm"
            >
              <option value="">줄간격</option>
              <option value="1.2">좁게</option>
              <option value="1.8">보통</option>
              <option value="2.4">넓게</option>
              <option value="3">아주 넓게</option>
            </select>

            <Sep />

            {/* 문단 기호 */}
            <Btn title="제목" onClick={() => prefixLines((l) => `## ${l}`)}>
              H2
            </Btn>
            <Btn title="글머리 기호" onClick={() => prefixLines((l) => `- ${l}`)}>
              • 목록
            </Btn>
            <Btn
              title="번호 목록"
              onClick={() => prefixLines((l, i) => `${i + 1}. ${l}`)}
            >
              1. 목록
            </Btn>
            <Btn title="인용" onClick={() => prefixLines((l) => `> ${l}`)}>
              ❝ 인용
            </Btn>

            <Sep />

            {/* 이모지 */}
            <Btn title="이모지" onClick={() => setShowEmoji((v) => !v)}>
              😀 이모지
            </Btn>
          </div>

          {showEmoji && (
            <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => insert(em)}
                  className="rounded px-1.5 py-1 text-lg hover:bg-gray-200"
                >
                  {em}
                </button>
              ))}
            </div>
          )}

          <textarea
            ref={ref}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={16}
            placeholder="내용을 입력하세요. 위 버튼으로 서식을 적용할 수 있어요."
            className="w-full resize-y rounded-b-md px-3 py-2 outline-none"
          />
        </>
      )}

      {tab === "preview" && (
        <div className="min-h-[16rem] px-3 py-3">
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-gray-400">작성한 내용이 여기 미리 보입니다.</p>
          )}
          {/* 미리보기 중에도 폼 제출 값 유지 */}
          <input type="hidden" name={name} value={value} />
        </div>
      )}
    </div>
  );
}

function Btn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

function TabBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-t-md px-3 py-1.5 text-sm font-medium ${
        active
          ? "border border-b-0 border-gray-200 bg-white text-gray-900"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-gray-200" />;
}
