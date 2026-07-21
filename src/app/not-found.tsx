import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {/* Large 404 */}
      <div className="relative mb-6">
        <h1 className="text-[120px] sm:text-[180px] font-display font-bold leading-none text-white/[0.03] select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl font-display font-bold neon-text">
            404
          </span>
        </div>
      </div>

      <p className="text-ink-secondary text-lg mb-2">
        Page not found
      </p>
      <p className="text-ink-muted text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="glass-panel-interactive px-5 py-2.5 text-sm font-medium text-ink-secondary hover:text-neon-cyan flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link
          href="/posts"
          className="glass-panel-interactive px-5 py-2.5 text-sm font-medium text-ink-secondary hover:text-neon-cyan flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Browse Posts
        </Link>
      </div>
    </div>
  );
}
