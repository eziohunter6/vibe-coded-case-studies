"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Parses the first integer in a string, e.g. "9 months" → { prefix: "", num: 9, suffix: " months" } */
function parse(value: string): { prefix: string; num: number; suffix: string } | null {
  const m = value.match(/^([^0-9]*)([0-9]+)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], num: parseInt(m[2], 10), suffix: m[3] };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedNumber({ value }: { value: string }) {
  const parsed = parse(value);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!parsed || reduce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!started || !parsed || reduce) return;

    const target = parsed.num;
    const duration = 1200;
    const startTime = performance.now();

    const frame = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.round(easeOutCubic(t) * target));
      if (t < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!parsed || reduce) return <span>{value}</span>;

  return (
    <span ref={ref}>
      {parsed.prefix}
      {started ? display : 0}
      {parsed.suffix}
    </span>
  );
}
