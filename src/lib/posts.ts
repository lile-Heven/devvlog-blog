import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTimeLib from "reading-time";
import type { Post, PostFrontmatter, PostSummary, TagInfo, TocEntry } from "@/types";
import { headingId, truncate } from "@/lib/utils";

// ============================================================
//  Constants
// ============================================================

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// Filesystem-safe slug pattern: YYYY-MM-DD-slug.mdx
const FILENAME_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)\.mdx?$/;

// ============================================================
//  Core: Read & Parse Posts
// ============================================================

/**
 * Read all MDX files from the content/posts directory,
 * parse frontmatter, compute reading time, and return full Post objects
 * sorted by date (newest first).
 */
export async function getAllPosts(includeDrafts = false): Promise<Post[]> {
  ensureDirectory(POSTS_DIR);

  const filenames = fs.readdirSync(POSTS_DIR).filter(isMdxFile);
  const posts: Post[] = [];

  for (const filename of filenames) {
    const parsed = parseFilename(filename);
    if (!parsed) continue;

    const filePath = path.join(POSTS_DIR, filename);
    const rawContent = fs.readFileSync(filePath, "utf-8");

    const { data, content } = matter(rawContent);
    const frontmatter = validateFrontmatter(data, parsed.slug, filename);

    if (!frontmatter) continue;
    if (!includeDrafts && frontmatter.draft) continue;

    const stats = readingTimeLib(content);

    posts.push({
      slug: parsed.slug,
      frontmatter,
      readingTime: Math.max(1, Math.round(stats.minutes)),
      wordCount: stats.words,
      content,
    });
  }

  // Sort by date descending (newest first)
  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return posts;
}

/**
 * Get a single post by its slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Find the file that matches the slug pattern
  const filenames = fs.readdirSync(POSTS_DIR).filter(isMdxFile);

  for (const filename of filenames) {
    const parsed = parseFilename(filename);
    if (!parsed || parsed.slug !== slug) continue;

    const filePath = path.join(POSTS_DIR, filename);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);
    const frontmatter = validateFrontmatter(data, slug, filename);
    if (!frontmatter) return null;

    const stats = readingTimeLib(content);

    return {
      slug,
      frontmatter,
      readingTime: Math.max(1, Math.round(stats.minutes)),
      wordCount: stats.words,
      content,
    };
  }

  return null;
}

/**
 * Get lightweight post summaries (excludes raw content) for list views.
 */
export async function getPostSummaries(
  includeDrafts = false
): Promise<PostSummary[]> {
  const posts = await getAllPosts(includeDrafts);
  return posts.map(toSummary);
}

/**
 * Get all unique tags with their usage counts, sorted by count descending.
 */
export async function getAllTags(): Promise<TagInfo[]> {
  const posts = await getAllPosts(false);
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      const normalized = tag.toLowerCase().trim();
      if (normalized) {
        tagMap.set(normalized, (tagMap.get(normalized) ?? 0) + 1);
      }
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get posts filtered by a specific tag.
 */
export async function getPostsByTag(tag: string): Promise<PostSummary[]> {
  const summaries = await getPostSummaries(false);
  const normalizedTag = tag.toLowerCase().trim();
  return summaries.filter((p) =>
    p.tags.map((t) => t.toLowerCase().trim()).includes(normalizedTag)
  );
}

/**
 * Search posts by keyword — matches against title, excerpt, tags, and content.
 * Returns PostSummary with a match context snippet.
 */
export async function searchPosts(query: string): Promise<PostSummary[]> {
  const posts = await getAllPosts(false);
  const q = query.toLowerCase().trim();
  if (!q) return posts.map(toSummary);

  return posts
    .filter((post) => {
      const searchable = [
        post.frontmatter.title,
        post.frontmatter.excerpt,
        ...post.frontmatter.tags,
        post.content.slice(0, 2000), // Search first 2000 chars of content
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    })
    .map(toSummary);
}

/**
 * Get adjacent posts (previous & next) for post navigation.
 */
export async function getAdjacentPosts(
  slug: string
): Promise<{ prev: PostSummary | null; next: PostSummary | null }> {
  const summaries = await getPostSummaries(false);
  const index = summaries.findIndex((p) => p.slug === slug);

  return {
    prev: index > 0 ? summaries[index - 1] ?? null : null,
    next: index < summaries.length - 1 ? summaries[index + 1] ?? null : null,
  };
}

// ============================================================
//  Helpers
// ============================================================

function ensureDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isMdxFile(filename: string): boolean {
  return filename.endsWith(".mdx") || filename.endsWith(".md");
}

interface ParsedFilename {
  dateStr: string;
  slug: string;
}

function parseFilename(filename: string): ParsedFilename | null {
  const match = filename.match(FILENAME_REGEX);
  if (!match) return null;
  return {
    dateStr: match[1] ?? "",
    slug: match[2] ?? filename.replace(/\.mdx?$/, ""),
  };
}

/**
 * Validate and normalize frontmatter data.
 * Returns null if required fields are missing or invalid.
 */
function validateFrontmatter(
  data: Record<string, unknown>,
  slug: string,
  filename: string
): PostFrontmatter | null {
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const date = typeof data.date === "string" ? data.date.trim() : "";
  const excerpt =
    typeof data.excerpt === "string" ? data.excerpt.trim() : "";

  if (!title || !date) {
    console.warn(
      `[posts] Skipping "${filename}": missing required frontmatter (title/date)`
    );
    return null;
  }

  // Validate date format
  if (isNaN(new Date(date).getTime())) {
    console.warn(
      `[posts] Skipping "${filename}": invalid date format "${date}"`
    );
    return null;
  }

  // Parse tags: can be string or array
  let tags: string[] = [];
  const rawTags = data.tags;
  if (Array.isArray(rawTags)) {
    tags = rawTags
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim())
      .filter(Boolean);
  } else if (typeof rawTags === "string") {
    tags = rawTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return {
    title,
    date,
    updatedAt:
      typeof data.updatedAt === "string" ? data.updatedAt.trim() : undefined,
    tags,
    excerpt: excerpt || truncate(title, 160),
    cover: typeof data.cover === "string" ? data.cover.trim() : undefined,
    draft: data.draft === true,
    featured: data.featured === true,
  };
}

function toSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.frontmatter.title,
    date: post.frontmatter.date,
    updatedAt: post.frontmatter.updatedAt,
    tags: post.frontmatter.tags,
    excerpt: post.frontmatter.excerpt,
    cover: post.frontmatter.cover,
    draft: post.frontmatter.draft ?? false,
    featured: post.frontmatter.featured ?? false,
    readingTime: post.readingTime,
    wordCount: post.wordCount,
  };
}

/**
 * Extract headings from raw MDX content for Table of Contents.
 * Matches ##, ###, #### headings.
 */
export function extractTocHeadings(rawContent: string): TocEntry[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const entries: TocEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(rawContent)) !== null) {
    const level = match[1]!.length as 2 | 3 | 4;
    const text = match[2]!.trim();
    const id = headingId(text);
    entries.push({ id, text, level });
  }

  return entries;
}
