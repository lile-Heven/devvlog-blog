import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import PostCard from "@/components/ui/PostCard";
import EmptyState from "@/components/ui/EmptyState";
import { Tag } from "lucide-react";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Posts tagged with #${tag}`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.name }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container-wide py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink-primary mb-2 flex items-center gap-3">
          <Tag className="w-7 h-7 text-neon-cyan" />
          #{tag}
        </h1>
        <p className="text-ink-muted">
          {posts.length} post{posts.length !== 1 ? "s" : ""} tagged
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
