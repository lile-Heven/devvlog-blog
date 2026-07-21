"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

// 用 any 大法，避开所有类型检查，保留全部功能
export default function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & {
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  // 直接 any，让 TS 闭嘴
  const codeChild = children as any;

  const className = codeChild?.props?.className ?? "";
  const language = className.replace("language-", "") || "text";

  const handleCopy = useCallback(async () => {
    if (!codeChild) return;
    const text =
      typeof codeChild.props?.children === "string"
        ? codeChild.props.children
        : "";
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [codeChild]);

  return (
    <div className="code-block-wrapper group">
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        <button onClick={handleCopy} className="code-block-copy" type="button">
          {copied ? (
            <span className="flex items-center gap-1 text-neon-cyan">
              <Check className="w-3 h-3" /> Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="w-3 h-3" /> Copy
            </span>
          )}
        </button>
      </div>
      <div className="code-block-content">
        <pre {...props}>{children}</pre>
      </div>
    </div>
  );
}

// 同时提供命名导出，兼容 import { Pre } 的写法
export { Pre };