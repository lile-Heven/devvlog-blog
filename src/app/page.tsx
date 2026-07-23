import { getPostSummaries } from "@/lib/posts";
import HeroSection from "@/components/home/HeroSection";
import PostList from "@/components/home/PostList";
import Timeline from "@/components/home/Timeline";

export default async function HomePage() {
  const posts = await getPostSummaries(false);

  // Featured posts pinned to top, then by date descending
  const sorted = [...posts].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <HeroSection />
      <PostList posts={sorted.slice(0, 6)} title="Latest Vlogs" />
      {sorted.length > 0 && <Timeline posts={sorted} />}
    </>
  );
}
