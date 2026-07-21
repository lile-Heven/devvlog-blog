import type { Metadata } from "next";
import { Terminal, Code2, Palette, Cpu, ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/types";

export const metadata: Metadata = {
  title: "About",
  description: "About this dev vlog blog and the person behind it.",
};

const techStack = [
  { name: "Next.js 15", desc: "React framework with App Router, RSC, and ISR" },
  { name: "TypeScript", desc: "Strict mode, full type safety" },
  { name: "Tailwind CSS", desc: "Custom neon-glass design system" },
  { name: "MDX", desc: "Markdown + JSX for rich content" },
  { name: "Framer Motion", desc: "Smooth animations and transitions" },
  { name: "Lucide Icons", desc: "Clean, consistent icon set" },
];

const features = [
  {
    icon: <Terminal className="w-5 h-5 text-neon-cyan" />,
    title: "MDX-Powered Writing",
    desc: "Write vlog entries in Markdown with embedded React components. Code blocks with syntax highlighting, callouts, and more.",
  },
  {
    icon: <Palette className="w-5 h-5 text-neon-gold" />,
    title: "Neon-Glass Design",
    desc: "Inspired by mineradio.art, featuring dark backgrounds, glass morphism panels, neon accents, and floating particles.",
  },
  {
    icon: <Code2 className="w-5 h-5 text-neon-blue" />,
    title: "Developer-First",
    desc: "TypeScript strict mode, ESLint, pretty error overlays, and fast refresh for a smooth development experience.",
  },
  {
    icon: <Cpu className="w-5 h-5 text-neon-cyan" />,
    title: "Optimized Performance",
    desc: "Static generation, image optimization, font subsetting, and minimal JavaScript for fast page loads.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-narrow py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-display font-bold text-ink-primary mb-3">
          About
        </h1>
        <p className="text-ink-secondary leading-relaxed max-w-xl">
          {SITE_CONFIG.description}
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass-panel p-5 hover:border-neon-cyan/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              {feature.icon}
              <h3 className="font-display font-semibold text-ink-primary text-sm">
                {feature.title}
              </h3>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="mb-12">
        <h2 className="text-xl font-display font-semibold text-ink-primary mb-4">
          Tech Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="glass-panel p-4 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-neon-cyan shrink-0" />
              <div>
                <p className="text-sm font-medium text-ink-primary">
                  {tech.name}
                </p>
                <p className="text-xs text-ink-muted">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspiration */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-display font-semibold text-ink-primary mb-2 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-neon-cyan" />
          Design Inspiration
        </h2>
        <p className="text-sm text-ink-secondary">
          The visual design of this blog draws inspiration from{" "}
          <a
            href="https://mineradio.art"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-cyan hover:underline"
          >
            mineradio.art
          </a>
          , an incredible music visualization platform built with WebGL,
          featuring stunning dark themes, neon accents, glass morphism panels,
          and interactive particle effects.
        </p>
      </div>
    </div>
  );
}
