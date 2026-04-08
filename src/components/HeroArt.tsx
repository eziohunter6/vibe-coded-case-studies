"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ParallaxLayer } from "@/components/ParallaxLayer";

export function HeroArt() {
  // Normalized mouse position: 0 → 1
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 22, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 22, damping: 18 });

  // Blob 1 drifts opposite the cursor (subtle parallax layer)
  const blob1X = useTransform(springX, [0, 1], [-32, 32]);
  const blob1Y = useTransform(springY, [0, 1], [-22, 22]);

  // Blob 2 drifts with the cursor (closer plane)
  const blob2X = useTransform(springX, [0, 1], [22, -22]);
  const blob2Y = useTransform(springY, [0, 1], [16, -16]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Static gradient layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(0,113,227,0.2),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_85%_70%,rgba(99,102,241,0.12),transparent_50%)]" />

      {/* Blob 1 — scroll + mouse parallax */}
      <motion.div style={{ x: blob1X, y: blob1Y }} className="absolute inset-0">
        <ParallaxLayer
          className="absolute -left-[20%] top-[5%] h-[min(100vw,720px)] w-[min(100vw,720px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(41,151,255,0.22),transparent_68%)] blur-3xl"
          yRange={[-40, 48]}
        />
      </motion.div>

      {/* Blob 2 — scroll + mouse parallax */}
      <motion.div style={{ x: blob2X, y: blob2Y }} className="absolute inset-0">
        <ParallaxLayer
          className="absolute -right-[25%] bottom-[-20%] h-[min(90vw,640px)] w-[min(90vw,640px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.14),transparent_65%)] blur-3xl"
          yRange={[36, -44]}
        />
      </motion.div>

      {/* Subtle third blob that reveals on mouse movement */}
      <motion.div
        className="absolute left-[45%] top-[30%] h-[min(50vw,380px)] w-[min(50vw,380px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,113,227,0.08),transparent_70%)] blur-3xl"
        style={{
          x: useTransform(springX, [0, 1], [-18, 18]),
          y: useTransform(springY, [0, 1], [-12, 12]),
        }}
      />

      <div className="grain" aria-hidden />
    </div>
  );
}
