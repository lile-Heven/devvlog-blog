"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PostSummary, TagInfo } from "@/types";
import PostCard from "@/components/ui/PostCard";
import SearchBar from "@/components/ui/SearchBar";
import TagBadge from "@/components/ui/TagBadge";
import EmptyState from "@/components/ui/EmptyState";
import { Search } from "lucide-react";

interface PostListClientProps {
  posts: PostSummary[];
  tags: TagInfo[];
}

const POSTS_PER_PAGE = 9;

export default function PostListClient({ posts, tags }: PostListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") ?? ""
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) ?? []
  );
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // --- Filter posts ---
  const filteredPosts = useMemo(() => {
    let result = posts;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.every((tag) =>
          p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
        )
      );
    }

    return result;
  }, [posts, searchQuery, selectedTags]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // --- Toggle tag ---
  const toggleTag = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => {
        const next = prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
        // Update URL
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (next.length > 0) params.set("tags", next.join(","));
        router.replace(`/posts${params.toString() ? `?${params.toString()}` : ""}`, {
          scroll: false,
        });
        return next;
      });
      setVisibleCount(POSTS_PER_PAGE);
    },
    [searchQuery, router]
  );

  // --- Search handler ---
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setVisibleCount(POSTS_PER_PAGE);
      const params = new URLSearchParams();
      if (value) params.set("q", value);
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
      router.replace(`/posts${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    },
    [selectedTags, router]
  );

  return (
    <>
      {/* Search + Tags */}
      <div className="space-y-4 mb-8">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search posts by title, excerpt, or tag..."
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge
                key={tag.name}
                tag={tag.name}
                count={tag.count}
                active={selectedTags.includes(tag.name)}
                onClick={() => toggleTag(tag.name)}
                linkable={false}
              />
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => {
                  setSelectedTags([]);
                  setVisibleCount(POSTS_PER_PAGE);
                  router.replace("/posts", { scroll: false });
                }}
                className="text-xs text-neon-cyan hover:text-neon-cyan/70 px-2 py-0.5"
                type="button"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description={
            searchQuery || selectedTags.length > 0
              ? "Try adjusting your search or filters."
              : "No posts published yet."
          }
          icon={<Search className="w-7 h-7" />}
        />
      ) : (
        <>
          <p className="text-sm text-ink-muted mb-4">
            Showing {visiblePosts.length} of {filteredPosts.length} post
            {filteredPosts.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() =>
                  setVisibleCount((c) => c + POSTS_PER_PAGE)
                }
                className="glass-panel-interactive px-6 py-2.5 text-sm text-ink-secondary hover:text-neon-cyan transition-colors"
                type="button"
              >
                Load more posts
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
