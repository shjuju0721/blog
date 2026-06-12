"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  defaultValue?: string;
};

const EMOJIS = [
  "😀", "😂", "🥰", "😎", "🤔", "😢", "😡", "👍", "👎", "👏",
  "🙏", "💪", "🔥", "✨", "🎉", "❤️", "💜", "💯", "✅", "❌",
  "⭐", "⚡", "🚀", "📌", "📝", "💡", "⚠️", "🎯", "🍀", "☕",
];

// 형광펜(배경) 색
const HIGHLIGHTS = ["#fef08a", "#bbf7d0", "#fbcfe8", "#bfdbfe", "#fed7aa"];
// 글자 색
const TEXT_COLORS = ["#111827", "#e11d48", "#ea580c", "#16a34a", "#2563eb", "#7c3aed"];
// 글자 크기
const SIZES: { label: string; value: string }[] = [
  { label: "작게", value: "0.85em" },
  { label: "보통", value: "1em" },
  { label: "크게", value: "1.4em" },
  { label: "아주 크게", value: "1.9em" },
];

export default function WysiwygEditor({ name, defaultValue }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(defaultValue ?? "");
  const [showEmoji, setShowEmoji] = useState(false);
  const initialized = useRef(false);

  // 최초 1회만 저장된 내용을 편집 영역에 주입 (커서 튐 방지로 controlled 안 함)
  useEffect(() => {
    if (!initialized.current && ref.current) {
      ref.current.innerHTML = defaultValue ?? "";
      initialized.current = true;
    }
  }, [defaultValue]);

  function sync() {
    if (ref.current) setHtml(ref.current.innerHTML);
  }

  // execCommand 실행 (style 을 CSS 인라인으로 출력하도록 설정)
  function exec(command: string, value?: string) {
    ref.current?.focus();
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {
      // 일부 브라우저 미지원 — 무시
    }
    document.execCommand(command, false, value);
    sync();
  }

  // 선택 영역을 style 속성을 가진 span 으로 감싸기 (글자 크기 등)
  function styleSelection(prop: "fontSize" | "backgroundColor" | "color", val: string) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      ref.current?.focus();
      return;
    }
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style[prop] = val;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      sel.removeAllRanges();
      const r = document.createRange();
      r.selectNodeContents(span);
      sel.addRange(r);
    } catch {
      // 여러 블록에 걸친 선택 등은 무시
    }
    sync();
  }

  function insertEmoji(em: string) {
    ref.current?.focus();
    document.execCommand("insertText", false, em);
    sync();
  }

  return (
    <div className="rounded-md border border-gray-300">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2">
        <Btn title="되돌리기" onClick={() => exec("undo")}>↶ 되돌리기</Btn>
        <Btn title="다시 실행" onClick={() => exec("redo")}>↷ 다시</Btn>

        <Sep />

        <Btn title="굵게" onClick={() => exec("bold")}><b>B</b></Btn>
        <Btn title="기울임" onClick={() => exec("italic")}><i>I</i></Btn>
        <Btn title="밑줄" onClick={() => exec("underline")}><u>U</u></Btn>
        <Btn title="취소선" onClick={() => exec("strikeThrough")}><s>S</s></Btn>

        <Sep />

        {/* 글자 크기 */}
        <select
          title="글자 크기"
          defaultValue=""
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            if (e.target.value) styleSelection("fontSize", e.target.value);
            e.target.value = "";
          }}
          className="rounded border border-gray-300 px-1.5 py-1 text-sm"
        >
          <option value="">크기</option>
          {SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <Sep />

        {/* 형광펜 */}
        <span className="text-sm text-gray-500">형광펜</span>
        {HIGHLIGHTS.map((c) => (
          <Swatch
            key={c}
            color={c}
            title={`형광펜 ${c}`}
            onClick={() => exec("hiliteColor", c)}
          />
        ))}

        <Sep />

        {/* 글자 색 */}
        <span className="text-sm text-gray-500">글자색</span>
        {TEXT_COLORS.map((c) => (
          <Swatch
            key={c}
            color={c}
            title={`글자색 ${c}`}
            onClick={() => exec("foreColor", c)}
          />
        ))}

        <Sep />

        {/* 정렬 */}
        <Btn title="왼쪽 정렬" onClick={() => exec("justifyLeft")}>⬅</Btn>
        <Btn title="가운데 정렬" onClick={() => exec("justifyCenter")}>⬌</Btn>
        <Btn title="오른쪽 정렬" onClick={() => exec("justifyRight")}>➡</Btn>

        <Sep />

        {/* 문단 기호 */}
        <Btn title="제목" onClick={() => exec("formatBlock", "h2")}>제목</Btn>
        <Btn title="글머리 기호" onClick={() => exec("insertUnorderedList")}>• 목록</Btn>
        <Btn title="번호 목록" onClick={() => exec("insertOrderedList")}>1. 목록</Btn>
        <Btn title="인용" onClick={() => exec("formatBlock", "blockquote")}>❝ 인용</Btn>
        <Btn title="서식 지우기" onClick={() => exec("removeFormat")}>서식 지우기</Btn>

        <Sep />

        {/* 이모지 */}
        <Btn title="이모지" onClick={() => setShowEmoji((v) => !v)}>😀 이모지</Btn>
      </div>

      {showEmoji && (
        <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
          {EMOJIS.map((em) => (
            <button
              key={em}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertEmoji(em)}
              className="rounded px-1.5 py-1 text-lg hover:bg-gray-200"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* 편집 영역 (보이는 그대로 = 결과) */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        data-placeholder="내용을 입력하세요. 글자를 드래그한 뒤 위 버튼으로 서식을 적용하면 바로 반영됩니다."
        className="wysiwyg min-h-[18rem] w-full px-3 py-3 text-[15px] leading-relaxed"
      />

      {/* 폼 제출용 값 */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

// 툴바 버튼: onMouseDown 으로 선택 영역을 유지한 채 명령 실행
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
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

function Swatch({
  color,
  onClick,
  title,
}: {
  color: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="h-6 w-6 rounded border border-gray-300"
      style={{ backgroundColor: color }}
    />
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-gray-200" />;
}
