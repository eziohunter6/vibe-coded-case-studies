"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

// Depth tiers: [xMin, xMax, yMin, yMax] — deeper tier moves more
const TIERS: [number, number, number, number][] = [
  [-3,  3,  -1.5, 1.5],
  [-7,  7,  -3.5, 3.5],
  [-12, 12, -6,   6  ],
  [-18, 18, [-9,  9  ][0], [-9, 9][1]],
];

interface ParallaxHeadlineProps {
  text: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export function ParallaxHeadline({
  text,
  id,
  className,
  style,
  delay = 0.1,
}: ParallaxHeadlineProps) {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLHeadingElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // Slow, cinematic spring — stiffness 55 = very smooth, damping 20 = no overshoot
  const springX = useSpring(rawX, { stiffness: 55, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 55, damping: 20 });

  useEffect(() => {
    if (prefersReduced) return;
    const onMove = (e: MouseEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.closest("section")?.getBoundingClientRect() ?? el.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced, rawX, rawY]);

  const words = text.split(" ");

  return (
    <h1
      ref={sectionRef}
      id={id}
      className={className}
      style={style}
      aria-label={text}
    >
      {words.map((word, i) => (
        <Word
          key={i}
          word={word}
          tier={TIERS[i % 4]}
          springX={springX}
          springY={springY}
          entryDelay={delay + i * 0.055}
          prefersReduced={!!prefersReduced}
          isLast={i === words.length - 1}
        />
      ))}
    </h1>
  );
}

function Word({
  word,
  tier,
  springX,
  springY,
  entryDelay,
  prefersReduced,
  isLast,
}: {
  word: string;
  tier: [number, number, number, number];
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
  entryDelay: number;
  prefersReduced: boolean;
  isLast: boolean;
}) {
  // Mouse parallax transforms — these ONLY go on the innermost span
  const mouseX = useTransform(springX, [-0.5, 0.5], [tier[0], tier[1]]);
  const mouseY = useTransform(springY, [-0.5, 0.5], [tier[2], tier[3]]);

  return (
    <>
      {/* Clip wrapper — prevents overflow during entry slide */}
      <span style={{ display: "inline-block", overflow: "hidden" }}>
        {/*
          Entry animation span — handles y: -40 → 0 and opacity.
          Never receives mouse transform props.
        */}
        <motion.span
          style={{ display: "inline-block" }}
          initial={prefersReduced ? false : { y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 36,
            delay: entryDelay,
          }}
        >
          {/*
            Mouse parallax span — handles x/y from useTransform only.
            Separated from entry span to avoid motion value conflict.
          */}
          <motion.span
            style={{
              display: "inline-block",
              x: prefersReduced ? undefined : mouseX,
              y: prefersReduced ? undefined : mouseY,
            }}
          >
            {word}
          </motion.span>
        </motion.span>
      </span>
      {!isLast && "\u00A0"}
    </>
  );
}
