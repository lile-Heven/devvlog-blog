"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Enhanced <pre> wrapper for code blocks.
 * Features:
 * - Language label from className
 * - Copy to clipboard button
 * - Neon border on hover
 */
export function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & {
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  // Extract language from the code element's className
  const codeChild = children as React.ReactElement | undefined;
  const className = codeChild?.props?.className ?? "";
  const language = className.replace("language-", "") || "text";

  const handleCopy = useCallback(async () => {
    if (!codeChild) return;
    // Extract text content from the code element
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
      // Fallback for older browsers
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
