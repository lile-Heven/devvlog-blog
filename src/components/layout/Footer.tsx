import Link from "next/link";
import { Terminal, Github, Rss } from "lucide-react";
import { SITE_CONFIG } from "@/types";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/5 mt-20">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Terminal className="w-5 h-5 text-neon-cyan" />
              <span className="font-display font-bold text-lg text-ink-primary">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-ink-secondary hover:text-neon-cyan transition-colors"
              >
                Home
              </Link>
              <Link
                href="/posts"
                className="text-sm text-ink-secondary hover:text-neon-cyan transition-colors"
              >
                All Posts
              </Link>
              <Link
                href="/about"
                className="text-sm text-ink-secondary hover:text-neon-cyan transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={SITE_CONFIG.author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-ink-muted hover:text-neon-cyan hover:bg-surface-hover transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <Link
                href="/api/rss"
                className="p-2 rounded-lg text-ink-muted hover:text-neon-cyan hover:bg-surface-hover transition-all"
                aria-label="RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">
            &copy; {currentYear} {SITE_CONFIG.name}. Built with Next.js &amp; MDX.
          </p>
          <p className="text-xs text-ink-muted">
            Design inspired by{" "}
            <a
              href="https://mineradio.art"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan/70 hover:text-neon-cyan transition-colors"
            >
              mineradio.art
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
