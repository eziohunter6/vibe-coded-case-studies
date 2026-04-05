"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation angle in degrees (applied on each axis) */
  maxTilt?: number;
};

export function TiltCard({ children, className = "", maxTilt = 4 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 280, damping: 28 });
  const rotateY = useSpring(rawRotateY, { stiffness: 280, damping: 28 });

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 → 0.5
    rawRotateX.set(normY * -maxTilt * 2);
    rawRotateY.set(normX * maxTilt * 2);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
