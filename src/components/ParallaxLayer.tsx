"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

type ParallaxLayerProps = {
  children?: React.ReactNode;
  className?: string;
  /** Subtle vertical shift multiplier (kept small for calm motion). */
  yRange?: [number, number];
};

export function ParallaxLayer({
  children,
  className = "",
  yRange = [-18, 18],
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
