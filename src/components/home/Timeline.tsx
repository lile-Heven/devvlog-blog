import Link from "next/link";
import { Calendar } from "lucide-react";
import type { PostSummary } from "@/types";
import { formatDate } from "@/lib/utils";

interface TimelineProps {
  posts: PostSummary[];
  maxItems?: number;
}

/**
 * Vertical timeline showing development vlog entries chronologically.
 * Each entry shows date (as a node) and title on the timeline line.
 */
export default function Timeline({ posts, maxItems = 10 }: TimelineProps) {
  const displayPosts = posts.slice(0, maxItems);

  if (displayPosts.length === 0) return null;

  return (
    <section className="container-wide py-16">
      <h2 className="text-2xl font-display font-bold text-ink-primary mb-8">
        Dev Timeline
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-neon-cyan/40 via-neon-blue/20 to-transparent" />

        <div className="space-y-6">
          {displayPosts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex items-start gap-4"
            >
              {/* Node */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center group-hover:border-neon-cyan/40 group-hover:bg-neon-cyan/5 transition-all duration-300">
                <Calendar className="w-4 h-4 text-ink-muted group-hover:text-neon-cyan transition-colors" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1.5">
                <span className="text-xs text-ink-muted font-mono block mb-0.5">
                  {formatDate(post.date)}
                </span>
                <h3 className="text-sm font-display font-semibold text-ink-secondary group-hover:text-neon-cyan transition-colors line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-xs text-ink-muted mt-1 line-clamp-1">
                  {post.excerpt}
                </p>
              </div>

              {/* Arrow on hover */}
              <span className="flex-shrink-0 pt-2 text-neon-cyan/0 group-hover:text-neon-cyan/60 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-sm">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
