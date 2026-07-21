import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  darkMode: "class", // Always dark — mineradio style
  theme: {
    extend: {
      /* === Color Palette: mineradio-inspired neon-on-black === */
      colors: {
        neon: {
          cyan: "#00F5D4",   // Primary accent — buttons, links, highlights
          gold: "#F4D28A",   // Secondary accent — icons, marks, secondary UI
          blue: "#7FD8FF",   // Tertiary accent — decorations, info hints
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.03)",   // Glass panel base
          hover: "rgba(255,255,255,0.06)",     // Glass panel hover
          border: "rgba(255,255,255,0.08)",    // Default border
          "border-hover": "rgba(0,245,212,0.30)", // Neon border on hover
        },
        ink: {
          primary: "rgba(255,255,255,0.92)",   // Main text
          secondary: "rgba(255,255,255,0.60)", // Secondary text
          muted: "rgba(255,255,255,0.38)",     // Muted / placeholder
        },
      },

      /* === Font Families === */
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "monospace"],
      },

      /* === Custom Keyframes === */
      keyframes: {
        "neon-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 4px rgba(0,245,212,0.3), 0 0 12px rgba(0,245,212,0.1)",
          },
          "50%": {
            boxShadow: "0 0 8px rgba(0,245,212,0.5), 0 0 24px rgba(0,245,212,0.2)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },

      /* === Animation Presets === */
      animation: {
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "cursor-blink": "cursor-blink 1s step-end infinite",
      },

      /* === Transition Duration === */
      transitionDuration: {
        "350": "350ms",
        "400": "400ms",
      },

      /* === Backdrop Blur Utilities === */
      backdropBlur: {
        xs: "2px",
        glass: "20px",
      },

      /* === Typography overrides for dark prose === */
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "rgba(255,255,255,0.85)",
            a: {
              color: "#00F5D4",
              textDecoration: "none",
              "&:hover": {
                color: "#33F7DE",
                textDecoration: "underline",
              },
            },
            h1: { color: "rgba(255,255,255,0.95)" },
            h2: { color: "rgba(255,255,255,0.92)" },
            h3: { color: "rgba(255,255,255,0.88)" },
            h4: { color: "rgba(255,255,255,0.84)" },
            strong: { color: "rgba(255,255,255,0.95)" },
            code: {
              color: "#00F5D4",
              backgroundColor: "rgba(0,245,212,0.08)",
              borderRadius: "4px",
              padding: "2px 6px",
              fontWeight: "500",
            },
            pre: {
              backgroundColor: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
            },
            blockquote: {
              borderLeftColor: "#00F5D4",
              color: "rgba(255,255,255,0.65)",
            },
            hr: { borderColor: "rgba(255,255,255,0.08)" },
            th: { color: "rgba(255,255,255,0.9)" },
            td: { color: "rgba(255,255,255,0.75)" },
            li: { color: "rgba(255,255,255,0.82)" },
            figcaption: { color: "rgba(255,255,255,0.5)" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
