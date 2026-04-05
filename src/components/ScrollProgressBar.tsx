"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? scrolled / max : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (reduce) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[200] h-[2px] w-full"
      aria-hidden
    >
      <motion.div
        className="h-full origin-left bg-[var(--cta)] will-change-transform"
        style={{ scaleX: progress }}
        transition={{ duration: 0 }}
      />
    </div>
  );
}
