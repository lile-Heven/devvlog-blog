"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Terminal } from "lucide-react";

/**
 * Hero section with typewriter effect subtitle.
 * Fades in smoothly on mount, features a typewriter animation
 * for the subtitle text, and a floating scroll-down indicator.
 */

const TYPING_TEXTS = [
  "Building the best blog, one commit at a time.",
  "Documenting every decision, every line of code.",
  "从零构建顶级品质开发博客。",
  "追求极致，永不妥协。",
];

export default function HeroSection() {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // --- Typewriter effect ---
  const tick = useCallback(() => {
    const currentText = TYPING_TEXTS[textIndex] ?? "";

    if (!isDeleting) {
      if (charIndex < currentText.length) {
        setCharIndex((c) => c + 1);
      } else {
        // Pause at end, then start deleting
        setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (charIndex > 0) {
        setCharIndex((c) => c - 1);
      } else {
        setIsDeleting(false);
        setTextIndex((i) => (i + 1) % TYPING_TEXTS.length);
      }
    }
  }, [charIndex, isDeleting, textIndex]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const speed = isDeleting ? 35 : 70;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  const currentText = TYPING_TEXTS[textIndex] ?? "";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-cyan/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/[0.03] rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isMounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 max-w-2xl"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isMounted ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 mb-8"
        >
          <Terminal className="w-8 h-8 text-neon-cyan" />
        </motion.div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-4">
          <span className="text-ink-primary">Dev</span>
          <span className="neon-text">Vlog</span>
        </h1>

        {/* Subtitle */}
        <p className="text-ink-secondary text-sm sm:text-base mb-2">
          开发日志 &middot; 每日记录 &middot; 品质至上
        </p>

        {/* Typewriter */}
        <div className="h-8 flex items-center justify-center">
          <span className="text-sm sm:text-base text-neon-cyan/80 font-mono">
            {currentText.slice(0, charIndex)}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-0.5 h-4 bg-neon-cyan ml-0.5 align-middle"
            />
          </span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isMounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-ink-muted"
      >
        <span className="text-xs font-mono tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
