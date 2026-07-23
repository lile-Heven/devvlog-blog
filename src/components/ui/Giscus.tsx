"use client";

import { useEffect, useRef } from "react";

interface GiscusProps {
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
}

/**
 * Giscus comments powered by GitHub Discussions.
 * Loads the Giscus script client-side only.
 *
 * To configure: visit https://giscus.app and fill in your repo details,
 * then replace the data-* attributes below.
 */
export default function Giscus({
  repo = "lile-Heven/devvlog-blog",
  repoId = "R_kgDOTfBD4A",
  category = "Announcements",
  categoryId = "DIC_kwDOTfBD4M4DBzaR",
}: GiscusProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Avoid duplicate script injection
    if (containerRef.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.appendChild(script);
  }, [repo, repoId, category, categoryId]);

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-display font-semibold text-ink-primary mb-4">
        Comments
      </h3>
      <div ref={containerRef} />
    </div>
  );
}
