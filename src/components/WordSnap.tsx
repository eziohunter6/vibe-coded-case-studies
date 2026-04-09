"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
};

export function WordSnap({
  text,
  as: Tag = "h2",
  id,
  className = "",
  style,
  delay = 0,
  stagger = 0.055,
}: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return (
      <Tag id={id} className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-6% 0px" }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 38,
            mass: 0.9,
            delay: delay + i * stagger,
          }}
        >
          {word}
          {i < words.length - 1 && <span aria-hidden>&nbsp;</span>}
        </motion.span>
      ))}
    </Tag>
  );
}
