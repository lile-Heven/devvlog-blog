import { Metadata } from "next";
import { Suspense } from "react";
import { getPostSummaries, getAllTags } from "@/lib/posts";
import PostListClient from "./PostListClient";

export const metadata: Metadata = {
  title: "All Posts",
  description: "Browse all development vlog entries.",
};

export default async function PostsPage() {
  const posts = await getPostSummaries(false);
  const tags = await getAllTags();

  return (
    <div className="container-wide py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink-primary mb-2">
          All Posts
        </h1>
        <p className="text-ink-muted">
          {posts.length} post{posts.length !== 1 ? "s" : ""} published
        </p>
      </div>

      <Suspense fallback={<PostListSkeleton />}>
        <PostListClient posts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 shimmer-bg rounded-xl" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 w-20 shimmer-bg rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 shimmer-bg rounded-xl" />
        ))}
      </div>
    </div>
  );
}
