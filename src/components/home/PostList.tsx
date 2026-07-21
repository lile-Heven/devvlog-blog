import type { PostSummary } from "@/types";
import PostCard from "@/components/ui/PostCard";

interface PostListProps {
  posts: PostSummary[];
  title?: string;
  emptyMessage?: string;
}

export default function PostList({
  posts,
  title = "Latest Posts",
  emptyMessage = "No posts yet. Check back soon!",
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <section className="container-wide py-16">
        <h2 className="text-2xl font-display font-bold text-ink-primary mb-2">
          {title}
        </h2>
        <p className="text-ink-muted">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="container-wide py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-ink-primary">
          {title}
        </h2>
        {posts.length > 6 && (
          <a
            href="/posts"
            className="text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors"
          >
            View all &rarr;
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
