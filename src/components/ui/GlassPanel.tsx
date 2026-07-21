import { cn } from "@/lib/utils";
import type { HTMLAttributes, ElementType } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Use an interactive variant (cursor pointer, hover lift) */
  interactive?: boolean;
  /** Render as a different HTML element */
  as?: ElementType;
  /** Remove border-radius */
  noRadius?: boolean;
  /** Stronger background opacity */
  elevated?: boolean;
}

/**
 * Reusable glass morphism panel.
 * Provides backdrop-blur, semi-transparent bg, and subtle border.
 */
export default function GlassPanel({
  children,
  className,
  interactive = false,
  as: Component = "div",
  noRadius = false,
  elevated = false,
  ...props
}: GlassPanelProps) {
  return (
    <Component
      className={cn(
        "border",
        elevated
          ? "bg-white/[0.05]"
          : "bg-white/[0.03]",
        "border-white/[0.08]",
        "backdrop-blur-xl",
        !noRadius && "rounded-xl",
        interactive && [
          "cursor-pointer",
          "hover:border-neon-cyan/30",
          "hover:bg-white/[0.05]",
          "hover:-translate-y-0.5",
          "hover:shadow-[0_4px_24px_rgba(0,245,212,0.06)]",
          "active:translate-y-0",
          "transition-all duration-350",
        ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
