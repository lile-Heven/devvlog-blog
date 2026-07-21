import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely — resolves conflicts and deduplicates.
 * Usage: cn("px-4", condition && "bg-red-500", "hover:scale-105")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a human-readable Chinese locale string.
 * e.g. "2026-07-21" → "2026年7月21日"
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Format a date string into a relative time string (Chinese).
 * e.g. "刚刚", "3天前", "2周前", "1个月前"
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 60) return "刚刚";
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffHour < 24) return `${diffHour}小时前`;
    if (diffDay < 7) return `${diffDay}天前`;
    if (diffWeek < 4) return `${diffWeek}周前`;
    if (diffMonth < 12) return `${diffMonth}个月前`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Truncate a string to a maximum length, appending "…" if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Slugify a string: lowercase, replace spaces with hyphens,
 * remove non-alphanumeric chars (except hyphens and Chinese chars).
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fff\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate a stable ID from a heading text for anchor links.
 */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fff\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
