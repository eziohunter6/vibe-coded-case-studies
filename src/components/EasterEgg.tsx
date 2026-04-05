"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SEQUENCE = "design";

export function EasterEgg() {
  const [show, setShow] = useState(false);
  const reduceMotion = useReducedMotion();
  const buffer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1 || !/[a-z]/i.test(e.key)) return;

      if (timer.current) clearTimeout(timer.current);
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-16);

      if (buffer.current.endsWith(SEQUENCE)) {
        setShow(true);
        buffer.current = "";
        window.setTimeout(() => setShow(false), 4500);
        return;
      }

      timer.current = setTimeout(() => {
        buffer.current = "";
      }, 1600);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [reduceMotion]);

  if (reduceMotion || !show) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 z-[90] max-w-sm -translate-x-1/2 rounded-full border border-[var(--line)] bg-[var(--surface-elevated)] px-6 py-2.5 text-center text-[14px] text-[var(--muted)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      Still here. Good eye.
    </p>
  );
}
