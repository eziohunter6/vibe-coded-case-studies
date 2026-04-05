"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { CSSProperties } from "react";

type AnimatedHeadlineProps = {
  text: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Delay before the first word starts (seconds) */
  initialDelay?: number;
};

export function AnimatedHeadline({
  text,
  id,
  className = "",
  style,
  initialDelay = 0.05,
}: AnimatedHeadlineProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return (
      <h1 id={id} className={className} style={style}>
        {text}
      </h1>
    );
  }

  return (
    <h1
      id={id}
      className={className}
      style={style}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{
            duration: 0.52,
            ease: [0.16, 1, 0.3, 1],
            delay: initialDelay + i * 0.055,
          }}
        >
          {word}
          {/* Non-breaking space between words */}
          {i < words.length - 1 && (
            <span aria-hidden>&nbsp;</span>
          )}
        </motion.span>
      ))}
    </h1>
  );
}
