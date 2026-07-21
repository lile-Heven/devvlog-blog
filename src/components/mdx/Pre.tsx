"use client";

import { useState, useCallback, isValidElement } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Enhanced <pre> wrapper for code blocks.
 * Features:
 * - Language label from className
 * - Copy to clipboard button (with fallback for older browsers)
 * - Neon border on hover
 *
 * Used as a named export in the MDX component registry (components.tsx).
 */
export function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  // Safely extract language from the first child code element's className
  let language = "text";
  if (isValidElement(children) && children.props) {
    const childProps = children.props as Record<string, unknown>;
    const rawClass = typeof childProps.className === "string" ? childProps.className : "";
    language = rawClass.replace("language-", "") || "text";
  }

  const handleCopy = useCallback(async () => {
    // Extract text content from the code element
    let text = "";
    if (isValidElement(children) && children.props) {
      const childProps = children.props as Record<string, unknown>;
      text = typeof childProps.children === "string" ? childProps.children : "";
    }
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
  }, [children]);

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
