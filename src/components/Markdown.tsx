import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// 서식(색상·글자크기·정렬·줄간격)을 위해 일부 HTML 태그/style 속성을 허용합니다.
// rehype-sanitize 로 스크립트 등 위험 요소는 제거하되, 표현용 태그만 통과시킵니다.
const schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "span",
    "div",
    "mark",
    "u",
    "sub",
    "sup",
    "ins",
    "small",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...(defaultSchema.attributes?.["*"] ?? []),
      "style",
      "align",
      "className",
    ],
  },
};

// 마크다운 본문을 HTML로 렌더링 (GFM: 표/체크박스/취소선 + 안전한 인라인 HTML)
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-600">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
