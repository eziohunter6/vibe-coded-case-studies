"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
const TOTAL_FRAMES = 18;
const INTERVAL_MS = 36;

export function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iterRef = useRef(0);
  const reduce = useReducedMotion();

  const scramble = () => {
    if (reduce) return;
    if (rafRef.current) clearInterval(rafRef.current);
    iterRef.current = 0;

    rafRef.current = setInterval(() => {
      iterRef.current++;
      const progress = iterRef.current / TOTAL_FRAMES;

      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "·") return char;
            if (i / text.length < progress) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      if (iterRef.current >= TOTAL_FRAMES) {
        if (rafRef.current) clearInterval(rafRef.current);
        setDisplay(text);
      }
    }, INTERVAL_MS);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) clearInterval(rafRef.current);
    };
  }, []);

  return (
    <span
      className={className}
      onMouseEnter={scramble}
      aria-label={text}
    >
      {display}
    </span>
  );
}
