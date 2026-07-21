"use client";

import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "@/components/mdx/components";

/**
 * Client-side MDX context provider.
 *
 * Wraps the app so that any MDX content rendered on the client
 * (e.g., dynamically loaded posts, previews) picks up the same
 * custom component styling. Server-side MDX compilation uses
 * the same component map via lib/mdx.ts.
 */
export default function MDXRenderer({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}
