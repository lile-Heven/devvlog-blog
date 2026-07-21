import type { MetadataRoute } from "next";
import { getPostSummaries, getAllTags } from "@/lib/posts";
import { SITE_CONFIG } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostSummaries(false);
  const tags = await getAllTags();

  const baseUrl = SITE_CONFIG.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${baseUrl}/tags/${tag.name}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
