"use client";

import { useState, useEffect, useCallback } from "react";
import { List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TocEntry } from "@/types";

interface TableOfContentsProps {
  headings: TocEntry[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // --- Intersection Observer to track active heading ---
  const handleScroll = useCallback(() => {
    if (headings.length === 0) return;

    // Find the last heading whose top is above viewport center
    const viewportCenter = window.innerHeight * 0.2;
    let currentId = headings[0]?.id ?? "";

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportCenter) {
        currentId = heading.id;
      }
    }

    setActiveId(currentId);
  }, [headings]);

  useEffect(() => {
    if (headings.length === 0) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Desktop: Sidebar TOC */}
      <nav className="hidden xl:block sticky top-24 w-56 shrink-0 self-start">
        <div className="glass-panel p-4 space-y-1">
          <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <List className="w-3.5 h-3.5" />
            On this page
          </h4>
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                "block text-sm py-1 border-l-2 pl-3 transition-all duration-200",
                heading.level === 3 && "pl-6",
                heading.level === 4 && "pl-9",
                activeId === heading.id
                  ? "border-neon-cyan text-neon-cyan"
                  : "border-transparent text-ink-muted hover:text-ink-secondary hover:border-white/15"
              )}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  setActiveId(heading.id);
                }
              }}
            >
              {heading.text}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile: Collapsible TOC */}
      <div className="xl:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-panel-interactive w-full p-4 flex items-center justify-between text-sm"
        >
          <span className="flex items-center gap-2 text-ink-secondary">
            <List className="w-4 h-4" />
            Table of Contents
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="text-ink-muted text-xs"
          >
            &#9654;
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="glass-panel border-t-0 rounded-t-none p-4 space-y-1">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={cn(
                      "block text-sm py-1.5 border-l-2 pl-3 transition-all duration-200",
                      heading.level === 3 && "pl-6",
                      heading.level === 4 && "pl-9",
                      activeId === heading.id
                        ? "border-neon-cyan text-neon-cyan"
                        : "border-transparent text-ink-muted hover:text-ink-secondary"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(heading.id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                      setIsOpen(false);
                    }}
                  >
                    {heading.text}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
