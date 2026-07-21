"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search posts...",
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: "/" to focus search
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !isFocused &&
        document.activeElement !== inputRef.current &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName ?? ""
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    },
    [isFocused]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300",
          "bg-surface border",
          isFocused
            ? "border-neon-cyan/40 shadow-[0_0_12px_rgba(0,245,212,0.08)]"
            : "border-surface-border hover:border-white/12"
        )}
      >
        <Search
          className={cn(
            "w-4 h-4 shrink-0 transition-colors duration-300",
            isFocused ? "text-neon-cyan" : "text-ink-muted"
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-muted outline-none font-body"
          aria-label="Search posts"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
              className="shrink-0 p-1 rounded-md text-ink-muted hover:text-neon-cyan hover:bg-surface-hover transition-colors"
              aria-label="Clear search"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard shortcut hint */}
      {!isFocused && !value && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-ink-muted bg-surface border border-surface-border rounded pointer-events-none">
          /
        </kbd>
      )}
    </div>
  );
}
