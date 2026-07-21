import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Clock, Tag as TagIcon, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPostBySlug, getPostSummaries, getAdjacentPosts, extractTocHeadings } from "@/lib/posts";
import { compileMdx } from "@/lib/mdx";
import { formatDate, cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/types";
import TagBadge from "@/components/ui/TagBadge";
import ReadingProgress from "@/components/ui/ReadingProgress";
import TableOfContents from "@/components/ui/TableOfContents";

// ============================================================
//  Props
// ============================================================

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================
//  generateMetadata — dynamic SEO per post
// ============================================================

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const ogImage = post.frontmatter.cover
    ? `${SITE_CONFIG.url}${post.frontmatter.cover}`
    : `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(post.frontmatter.title)}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: "article",
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updatedAt,
      tags: post.frontmatter.tags,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: ogImage,
    },
  };
}

// ============================================================
//  generateStaticParams — SSG all posts at build time
// ============================================================

export async function generateStaticParams() {
  const posts = await getPostSummaries(false);
  return posts.map((post) => ({ slug: post.slug }));
}

// ============================================================
//  Page Component
// ============================================================

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Compile MDX content (with error recovery)
  let content: React.ReactElement;
  try {
    const compiled = await compileMdx(post.content);
    content = compiled.content;
  } catch (err) {
    console.error(`[PostPage] Failed to compile MDX for slug "${slug}":`, err);
    content = (
      <div className="glass-panel p-8 text-center">
        <h2 className="text-xl font-display font-semibold text-neon-gold mb-2">
          Render Error
        </h2>
        <p className="text-ink-muted text-sm">
          This post contains malformed MDX content. Please check the source file.
        </p>
      </div>
    );
  }

  // Adjacent posts for navigation
  const { prev, next } = await getAdjacentPosts(slug);

  // Extract TOC headings
  const tocHeadings = extractTocHeadings(post.content);

  return (
    <>
      <ReadingProgress />

      <article className="container-wide py-12">
        {/* Post Header */}
        <header className="mb-10">
          {/* Back link */}
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-neon-cyan transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </Link>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-ink-primary mb-4 leading-tight">
            {post.frontmatter.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.frontmatter.date)}
            </span>
            {post.frontmatter.updatedAt && (
              <span className="flex items-center gap-1.5">
                <span className="text-neon-gold">Updated:</span>
                {formatDate(post.frontmatter.updatedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
          </div>

          {/* Tags */}
          {post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <TagIcon className="w-4 h-4 text-ink-muted" />
              {post.frontmatter.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </header>

        {/* Content with TOC sidebar */}
        <div className="flex gap-10 xl:gap-16">
          {/* Table of Contents — desktop sidebar */}
          <TableOfContents headings={tocHeadings} />

          {/* MDX Content */}
          <div className="flex-1 min-w-0">
            {/* Cover Image */}
            {post.frontmatter.cover && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 border border-white/5">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.frontmatter.cover})` }}
                />
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              {content}
            </div>

            {/* Post Navigation */}
            <nav className="mt-16 pt-8 border-t border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/posts/${prev.slug}`}
                    className="glass-panel-interactive p-4 group"
                  >
                    <span className="flex items-center gap-1 text-xs text-ink-muted mb-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </span>
                    <span className="text-sm font-medium text-ink-secondary group-hover:text-neon-cyan transition-colors line-clamp-1">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {next && (
                  <Link
                    href={`/posts/${next.slug}`}
                    className="glass-panel-interactive p-4 group text-right"
                  >
                    <span className="flex items-center justify-end gap-1 text-xs text-ink-muted mb-1">
                      Next <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="text-sm font-medium text-ink-secondary group-hover:text-neon-cyan transition-colors line-clamp-1">
                      {next.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>

            {/* Giscus Comments */}
            <div className="mt-12">
              <CommentsSection />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

// ============================================================
//  Giscus Comments (loaded client-side only)
// ============================================================

function CommentsSection() {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-display font-semibold text-ink-primary mb-4">
        Comments
      </h3>
      <p className="text-sm text-ink-muted mb-4">
        Leave a comment via GitHub Discussions.
      </p>
      {/* Giscus script loads client-side via next/script would work,
          but for simplicity, we provide a link to set up Giscus */}
      <div className="text-sm text-ink-secondary">
        <p>
          To enable comments, set up{" "}
          <a
            href="https://giscus.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-cyan hover:underline"
          >
            Giscus
          </a>{" "}
          with your GitHub repository.
        </p>
      </div>
    </div>
  );
}
