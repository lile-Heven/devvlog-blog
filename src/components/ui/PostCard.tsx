"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { PostSummary } from "@/types";
import { formatDate, cn } from "@/lib/utils";
import TagBadge from "@/components/ui/TagBadge";

interface PostCardProps {
  post: PostSummary;
  index?: number;
}

/**
 * Article card with glass morphism styling.
 * Displays title, excerpt, date, reading time, and tags.
 */
export default function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/posts/${post.slug}`} className="block group">
        <div className="glass-panel-interactive p-6 h-full flex flex-col">
          {/* Cover image (if any) */}
          {post.cover && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 border border-white/5">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${post.cover})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag} tag={tag} linkable={false} />
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-ink-muted self-center">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-display font-bold text-ink-primary mb-2 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-ink-secondary leading-relaxed mb-4 line-clamp-2 flex-1">
            {post.excerpt}
          </p>

          {/* Meta line */}
          <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min read
              </span>
            </div>
            <span
              className={cn(
                "flex items-center gap-1 text-neon-cyan/0 group-hover:text-neon-cyan/70 transition-all duration-300",
                "transform translate-x-2 group-hover:translate-x-0"
              )}
            >
              Read <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
