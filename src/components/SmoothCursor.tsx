"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function SmoothCursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const ringX = useSpring(cursorX, { stiffness: 180, damping: 22, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 180, damping: 22, mass: 0.5 });

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(pointer: fine)");
    setIsPointer(mq.matches);
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as Element;
      setHovering(
        !!target.closest(
          'a, button, [role="button"], input, label, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Hide native cursor via JS so SSR doesn't break
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.style.cursor = "";
    };
  }, [cursorX, cursorY, visible]);

  if (!mounted || !isPointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Dot — follows cursor exactly */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          background: "var(--text)",
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: clicking ? 0.5 : hovering ? 0.35 : 1,
          opacity: visible ? 0.9 : 0,
        }}
        transition={{ duration: 0.12 }}
      />
      {/* Ring — lags behind for depth */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: 38,
          height: 38,
          borderColor: "var(--text)",
          left: ringX,
          top: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: clicking ? 0.75 : hovering ? 1.55 : 1,
          opacity: visible ? 0.45 : 0,
        }}
        transition={{ duration: 0.18 }}
      />
    </div>
  );
}
