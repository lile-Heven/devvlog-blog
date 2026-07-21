"use client";

import { useEffect, useRef, useCallback } from "react";

// ============================================================
//  Particle System Configuration
// ============================================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  opacity: number;
  baseOpacity: number;
  hue: number; // 160 (cyan) to 200 (blue)
}

const CONFIG = {
  /** Target particle count at 1920x1080 — scaled for viewport */
  targetDensity: 0.00004, // particles per pixel²
  minParticles: 40,
  maxParticles: 160,

  /** Particle appearance */
  minSize: 0.8,
  maxSize: 2.4,
  minOpacity: 0.1,
  maxOpacity: 0.45,

  /** Motion */
  baseSpeed: 0.15,
  speedVariance: 0.25,

  /** Mouse interaction */
  mouseRadius: 140,
  mouseForce: 0.6,

  /** Line connections */
  connectionDistance: 140,
  connectionOpacity: 0.06,

  /** Color range (HSL hue) — cyan to blue */
  hueMin: 160,
  hueMax: 200,
};

// ============================================================
//  ParticleCanvas Component
// ============================================================

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // --- Initialize particles ---
  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(
      CONFIG.maxParticles,
      Math.max(
        CONFIG.minParticles,
        Math.floor(width * height * CONFIG.targetDensity)
      )
    );

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.speedVariance,
        vy: (Math.random() - 0.5) * CONFIG.speedVariance,
        size: CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize),
        baseSize: 0,
        opacity:
          CONFIG.minOpacity +
          Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity),
        baseOpacity: 0,
        hue:
          CONFIG.hueMin + Math.random() * (CONFIG.hueMax - CONFIG.hueMin),
      });
      // Store base values for pulsing
      particles[i]!.baseSize = particles[i]!.size;
      particles[i]!.baseOpacity = particles[i]!.opacity;
    }

    particlesRef.current = particles;
  }, []);

  // --- Animation loop ---
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensionsRef.current;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!;

      // --- Mouse interaction ---
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * CONFIG.mouseForce * 0.5;
        p.vy -= Math.sin(angle) * force * CONFIG.mouseForce * 0.5;

        // Increase opacity near mouse
        p.opacity = Math.min(
          p.baseOpacity * 2.5,
          p.baseOpacity + force * 0.6
        );
        p.size = p.baseSize + force * 1.5;
      } else {
        // Lerp back to base values
        p.opacity += (p.baseOpacity - p.opacity) * 0.02;
        p.size += (p.baseSize - p.size) * 0.02;
      }

      // --- Move ---
      p.x += p.vx * CONFIG.baseSpeed;
      p.y += p.vy * CONFIG.baseSpeed;

      // Add slight random drift
      p.vx += (Math.random() - 0.5) * 0.01;
      p.vy += (Math.random() - 0.5) * 0.01;

      // Dampen velocity
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Wrap around edges
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      // --- Draw particle ---
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
      ctx.fill();

      // Add subtle glow for larger particles
      if (p.size > 1.6) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity * 0.08})`;
        ctx.fill();
      }
    }

    // --- Draw connections ---
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i]!;
        const b = particles[j]!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          const alpha =
            CONFIG.connectionOpacity * (1 - dist / CONFIG.connectionDistance);
          const avgHue = (a.hue + b.hue) / 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `hsla(${avgHue}, 90%, 65%, ${alpha})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // --- Resize handler ---
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for perf
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    dimensionsRef.current = { width, height };
    initParticles(width, height);
  }, [initParticles]);

  // --- Mouse move handler ---
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  // --- Touch handler ---
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      mouseRef.current = {
        x: e.touches[0]!.clientX,
        y: e.touches[0]!.clientY,
      };
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  // --- Setup & teardown ---
  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleResize, handleMouseMove, handleMouseLeave, handleTouchMove, handleTouchEnd, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      aria-hidden="true"
    />
  );
}
