import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIMessage({ content }) {
  return (
    <div className="ai-message">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}