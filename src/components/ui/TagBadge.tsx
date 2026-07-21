import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  active?: boolean;
  count?: number;
  linkable?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

export default function TagBadge({
  tag,
  active = false,
  count,
  linkable = true,
  onClick,
  size = "sm",
}: TagBadgeProps) {
  const content = (
    <>
      <span>#{tag}</span>
      {count !== undefined && (
        <span className="ml-1 text-neon-cyan/50">{count}</span>
      )}
    </>
  );

  const classes = cn(
    "inline-flex items-center gap-1 rounded-full font-medium transition-all duration-300",
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
    active
      ? "bg-neon-cyan/12 text-neon-cyan border border-neon-cyan/30"
      : "bg-surface border border-surface-border text-ink-secondary hover:text-neon-cyan hover:border-neon-cyan/25 hover:bg-neon-cyan/5"
  );

  if (linkable && !onClick) {
    return (
      <Link href={`/tags/${tag}`} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={classes} type="button">
        {content}
      </button>
    );
  }

  return <span className={classes}>{content}</span>;
}
