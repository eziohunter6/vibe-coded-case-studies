"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const AI_PHRASES = [
  "umm.. does this count as design? 🤔",
  "the model keeps surprising me ✨",
  "honestly still figuring it out 🙈",
  "I built it to understand it 🔧",
  "faster at being wrong, basically 😅",
  "prompting feels like briefing.. kinda 🤷",
  "shipped more than I planned 🚀",
];

export function SmoothCursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Typewriter state
  const [displayText, setDisplayText] = useState("you");
  const displayRef = useRef("you");
  const [targetPhrase, setTargetPhrase] = useState("you");
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AI sequence state
  const aiIndexRef = useRef(0);
  const aiVisitedRef = useRef(false);
  const inAiSectionRef = useRef(false);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter: erase current text then type target
  useEffect(() => {
    const target = targetPhrase;

    const step = () => {
      const cur = displayRef.current;
      if (cur === target) return;

      if (animRef.current) clearTimeout(animRef.current);

      if (cur.length > 0 && !target.startsWith(cur)) {
        // Erase one char
        const next = cur.slice(0, -1);
        displayRef.current = next;
        setDisplayText(next);
        animRef.current = setTimeout(step, 28);
      } else {
        // Type one char
        const next = target.slice(0, cur.length + 1);
        displayRef.current = next;
        setDisplayText(next);
        animRef.current = setTimeout(step, 62);
      }
    };

    step();

    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [targetPhrase]);

  // AI phrase cycling: when display matches target and we're in AI section, advance after 1.5s
  useEffect(() => {
    if (
      displayText === targetPhrase &&
      inAiSectionRef.current &&
      targetPhrase !== "you again." &&
      AI_PHRASES.includes(targetPhrase)
    ) {
      aiTimerRef.current = setTimeout(() => {
        if (!inAiSectionRef.current) return;
        aiIndexRef.current = (aiIndexRef.current + 1) % AI_PHRASES.length;
        const next = AI_PHRASES[aiIndexRef.current];
        setTargetPhrase(next);
      }, 1500);
    }
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [displayText, targetPhrase]);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(pointer: fine)");
    setIsPointer(mq.matches);

    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (!mq.matches) {
      return () => observer.disconnect();
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      // Detect which section the cursor is over
      const el = document.elementFromPoint(e.clientX, e.clientY) as Element | null;
      const labeled = el?.closest("[data-cursor-label]");
      const label = labeled?.getAttribute("data-cursor-label") ?? "you";

      const wasInAi = inAiSectionRef.current;
      const nowInAi = label === "__sequence__";
      inAiSectionRef.current = nowInAi;

      if (!nowInAi) {
        if (wasInAi) {
          // Just left AI section, mark as visited
          aiVisitedRef.current = true;
          if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
        }
        setTargetPhrase((prev) => (prev !== label ? label : prev));
      } else if (!wasInAi) {
        // Just entered AI section
        const phrase = aiVisitedRef.current
          ? "you again."
          : AI_PHRASES[aiIndexRef.current % AI_PHRASES.length];
        setTargetPhrase((prev) => (prev !== phrase ? phrase : prev));
      }
      // If still in AI section and already cycling, don't interrupt
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
    document.documentElement.style.cursor = "none";

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.style.cursor = "";
    };
  }, [mouseX, mouseY]);

  if (!mounted || !isPointer) return null;

  const arrowFill = isDark ? "#f5f5f5" : "#111111";

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@600&display=swap');`}</style>
      <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
        <motion.div
          style={{ position: "absolute", left: mouseX, top: mouseY }}
          animate={{ scale: clicking ? 0.83 : 1, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.08 }}
        >
          {/* Thick 4-point kite arrowhead */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <path d="M 2 2 L 22 9.5 L 13.5 13.5 L 9.5 22 Z" fill={arrowFill} />
          </svg>

          {/* Contextual typewriter badge */}
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 28,
              background: "#dde8ff",
              border: "1.5px solid #ffffff",
              borderRadius: 12,
              padding: "6px 12px",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 40,
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                fontSize: 16,
                fontWeight: 600,
                color: "#111111",
                lineHeight: 1,
                letterSpacing: "0.01em",
                display: "block",
              }}
            >
              {displayText}
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1em",
                  background: "#111111",
                  marginLeft: 1,
                  verticalAlign: "text-bottom",
                  animation: "cursor-blink 1s step-end infinite",
                }}
              />
            </span>
          </div>
        </motion.div>
      </div>
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
