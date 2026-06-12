import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 마크다운 본문을 HTML로 렌더링 (GFM: 표/체크박스/취소선 등 지원)
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-600">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
