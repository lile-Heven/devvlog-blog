import { isValidElement } from "react";
import { CopyButton } from "@/components/mdx/CopyButton";

/**
 * Enhanced <pre> wrapper for code blocks.
 * Features:
 * - Language label from className
 * - Interactive copy button (client component)
 * - Neon border on hover
 *
 * NOTE: This file must NOT have "use client" — it is consumed by
 * compileMDX on the server. Hooks are not allowed here.
 * CopyButton is a client component rendered as a child — this is safe.
 */
export function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  // Safely extract language and code text from the first child code element
  let language = "text";
  let codeText = "";
  if (isValidElement(children) && children.props) {
    const childProps = children.props as Record<string, unknown>;
    const rawClass = typeof childProps.className === "string" ? childProps.className : "";
    language = rawClass.replace("language-", "") || "text";
    codeText = typeof childProps.children === "string" ? childProps.children : "";
  }

  return (
    <div className="code-block-wrapper group">
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        <CopyButton text={codeText} />
      </div>
      <div className="code-block-content">
        <pre {...props}>{children}</pre>
      </div>
    </div>
  );
}
