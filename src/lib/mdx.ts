import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx/components";

/**
 * Compile raw MDX source into a React element tree.
 * Uses next-mdx-remote/rsc for React Server Component compatibility.
 *
 * Custom components (Pre, Callout, code styling, etc.) are imported
 * directly from the canonical registry at @/components/mdx/components.
 */
export async function compileMdx(source: string): Promise<{
  content: React.ReactElement;
  frontmatter: Record<string, unknown>;
}> {
  const result = await compileMDX<Record<string, unknown>>({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: "heading-anchor",
                ariaHidden: "true",
                tabIndex: -1,
              },
              content: {
                type: "text",
                value: "#",
              },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: false,
            },
          ],
        ],
      },
      parseFrontmatter: true,
    },
  });

  return {
    content: result.content,
    frontmatter: (result.frontmatter ?? {}) as Record<string, unknown>,
  };
}
