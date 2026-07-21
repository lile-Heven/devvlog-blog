import { isValidElement } from "react";
import { Copy } from "lucide-react";

/**
 * Enhanced <pre> wrapper for code blocks.
 * Features:
 * - Language label from className
 * - Copy button (visual; interactivity added later via client wrapper)
 * - Neon border on hover
 *
 * NOTE: This file must NOT have "use client" — it is consumed by
 * compileMDX on the server. Hooks are not allowed here.
 */
export function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  // Safely extract language from the first child code element's className
  let language = "text";
  if (isValidElement(children) && children.props) {
    const childProps = children.props as Record<string, unknown>;
    const rawClass = typeof childProps.className === "string" ? childProps.className : "";
    language = rawClass.replace("language-", "") || "text";
  }

  return (
    <div className="code-block-wrapper group">
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        <span className="code-block-copy flex items-center gap-1">
          <Copy className="w-3 h-3" /> Copy
        </span>
      </div>
      <div className="code-block-content">
        <pre {...props}>{children}</pre>
      </div>
    </div>
  );
}
