// ============================================================
//  Global Type Definitions for DevVlog Blog
// ============================================================

/** Frontmatter metadata stored at the top of each MDX post */
export interface PostFrontmatter {
  title: string;
  date: string;          // ISO 8601 date string e.g. "2026-07-21"
  updatedAt?: string;    // Last modified date
  tags: string[];        // Lowercase, hyphenated e.g. ["nextjs", "dev-vlog"]
  excerpt: string;        // Short summary (120-200 chars)
  cover?: string;         // Optional cover image path or URL
  draft?: boolean;        // If true, excluded from production builds
  featured?: boolean;     // If true, pinned to top / hero
}

/** A fully resolved post — frontmatter + computed fields */
export interface Post {
  slug: string;               // URL-friendly identifier derived from filename
  frontmatter: PostFrontmatter;
  readingTime: number;        // Estimated reading time in minutes
  wordCount: number;          // Total word count
  content: string;            // Raw MDX source
}

/** Lightweight post summary (no raw content) — used in list views */
export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  tags: string[];
  excerpt: string;
  cover?: string;
  draft: boolean;
  featured: boolean;
  readingTime: number;
  wordCount: number;
}

/** Tag with usage count */
export interface TagInfo {
  name: string;
  count: number;
}

/** Navigation item for header/footer */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/** Table of Contents heading entry */
export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

/** Search result entry */
export interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  matchContext: string; // Snippet showing where the match occurred
}

/** Site-wide configuration constants */
export const SITE_CONFIG = {
  name: "DevVlog",
  title: "DevVlog — 开发日志",
  description: "从零构建顶级品质的个人博客，记录每日开发历程与思考。",
  url: "https://devvlog.vercel.app",
  language: "zh-CN",
  author: {
    name: "Heven",
    url: "https://github.com",
  },
} as const;

/** Navigation links */
export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Posts", href: "/posts" },
  { label: "About", href: "/about" },
];
