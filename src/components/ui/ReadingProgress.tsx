"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

/**
 * A fixed top-of-page reading progress bar.
 * Shows how much of the article the user has scrolled through.
 */
export default function ReadingProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      setScrollProgress(0);
      return;
    }
    const progress = Math.min(scrollTop / docHeight, 1);
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scaleX = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const width = useTransform(scaleX, (v) => `${v * 100}%`);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{ scaleX }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-cyan" />
      <div className="absolute inset-0 blur-sm bg-neon-cyan/60" />
    </motion.div>
  );
}
