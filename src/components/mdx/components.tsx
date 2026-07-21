/**
 * Canonical MDX component registry.
 *
 * This module is the single source of truth for all custom MDX components.
 * It is imported by lib/mdx.ts (server-side) for compileMDX.
 * NOTE: This file must NOT have "use client" — compileMDX needs actual
 * component functions, not client references.
 */

import type { MDXComponents } from "mdx/types";
import { Pre } from "@/components/mdx/Pre";
import { Callout } from "@/components/mdx/Callout";

export const mdxComponents: MDXComponents = {
  pre: Pre,
  Callout,

  // Inline code
  code: ({ className, children, ...props }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="bg-neon-cyan/[0.08] text-neon-cyan rounded px-1.5 py-0.5 text-[0.9em] font-mono border border-neon-cyan/10"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // External links open in new tab
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-neon-cyan hover:text-neon-cyan/80 underline decoration-neon-cyan/30 hover:decoration-neon-cyan transition-all"
        {...props}
      >
        {children}
      </a>
    );
  },

  // Images
  img: (props) => (
    <img
      className="rounded-xl border border-white/5 my-6"
      loading="lazy"
      {...props}
      alt={props.alt ?? ""}
    />
  ),

  // Blockquotes
  blockquote: (props) => (
    <blockquote
      className="border-l-[3px] border-neon-cyan bg-neon-cyan/[0.03] py-3 px-5 rounded-r-lg my-5 italic text-ink-secondary"
      {...props}
    />
  ),

  hr: (props) => <hr className="border-white/8 my-8" {...props} />,

  // Tables
  table: (props) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-white/10 px-4 py-2 text-left font-semibold text-ink-primary bg-surface"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-white/5 px-4 py-2 text-ink-secondary"
      {...props}
    />
  ),
};
