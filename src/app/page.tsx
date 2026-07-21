import { getPostSummaries } from "@/lib/posts";
import HeroSection from "@/components/home/HeroSection";
import PostList from "@/components/home/PostList";
import Timeline from "@/components/home/Timeline";

export default async function HomePage() {
  const posts = await getPostSummaries(false);

  return (
    <>
      <HeroSection />
      <PostList posts={posts.slice(0, 6)} title="Latest Vlogs" />
      {posts.length > 0 && <Timeline posts={posts} />}
    </>
  );
}
