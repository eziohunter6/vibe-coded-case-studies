"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** Constrain width and centre — e.g. "420px" for portrait phone mockups */
  maxWidth?: string;
  /** Image intrinsic width in px (default 720) */
  imgW?: number;
  /** Image intrinsic height in px (default 1400) */
  imgH?: number;
  /** Animate to a position from outside; increment `id` to re-trigger */
  targetPos?: { pos: number; id: number } | null;
  /** Called on every position change so the parent can sync state */
  onPositionChange?: (position: number) => void;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  maxWidth,
  imgW = 720,
  imgH = 1400,
  targetPos,
  onPositionChange,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const positionRef = useRef(50);
  const isDragging = useRef(false);
  const hasInteracted = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Keep callback in a ref so syncPosition never needs to change reference
  const onPositionChangeRef = useRef(onPositionChange);
  useEffect(() => { onPositionChangeRef.current = onPositionChange; }, [onPositionChange]);

  const syncPosition = useCallback((p: number) => {
    positionRef.current = p;
    setPosition(p);
    onPositionChangeRef.current?.(p);
  }, []); // stable — reads callback through ref

  const animateTo = useCallback(
    (target: number, duration = 550) => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      const from = positionRef.current;
      const startTime = performance.now();
      function frame(now: number) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        syncPosition(from + (target - from) * eased);
        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(frame);
        } else {
          animFrameRef.current = null;
        }
      }
      animFrameRef.current = requestAnimationFrame(frame);
    },
    [syncPosition]
  );

  // Animate when the parent clicks Before / After
  useEffect(() => {
    if (!targetPos) return;
    hasInteracted.current = true;
    animateTo(targetPos.pos);
  }, [targetPos, animateTo]);

  // One-shot hint sweep on mount
  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => {
      if (hasInteracted.current) return;
      animateTo(32, 1100);
      setTimeout(() => {
        if (!hasInteracted.current) animateTo(50, 900);
      }, 1100);
    }, 900);
    return () => clearTimeout(timer);
  }, [prefersReduced, animateTo]);

  const updatePosition = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      syncPosition(Math.min(98, Math.max(2, pct)));
    },
    [syncPosition]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      hasInteracted.current = true;
      isDragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      hasInteracted.current = true;
      if (e.key === "ArrowLeft") syncPosition(Math.max(2, positionRef.current - 5));
      if (e.key === "ArrowRight") syncPosition(Math.min(98, positionRef.current + 5));
    },
    [syncPosition]
  );

  const outerStyle: React.CSSProperties = maxWidth
    ? { maxWidth, margin: "0 auto" }
    : {};

  if (prefersReduced) {
    return (
      <div style={outerStyle} className="flex gap-4">
        <div style={{ flex: 1, overflow: "hidden", borderRadius: 16 }}>
          <Image src={beforeSrc} alt={beforeAlt} width={imgW} height={imgH} className="w-full h-auto block" />
        </div>
        <div style={{ flex: 1, overflow: "hidden", borderRadius: 16 }}>
          <Image src={afterSrc} alt={afterAlt} width={imgW} height={imgH} className="w-full h-auto block" />
        </div>
      </div>
    );
  }

  return (
    <div style={outerStyle}>
      {/* Interactive slider frame */}
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative w-full select-none"
        style={{ cursor: "ew-resize", borderRadius: 16, overflow: "hidden" }}
      >
          {/* After image — base layer */}
          <Image
            src={afterSrc}
            alt={afterAlt}
            width={imgW}
            height={imgH}
            className="block w-full h-auto"
            draggable={false}
          />

          {/* Before image — clipped, GPU composited */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              transform: "translateZ(0)",
            }}
          >
            <Image
              src={beforeSrc}
              alt={beforeAlt}
              width={imgW}
              height={imgH}
              className="block w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Divider line */}
          <div
            className="pointer-events-none absolute inset-y-0 -translate-x-1/2"
            style={{ left: `${position}%`, width: 2, background: "rgba(255,255,255,0.9)" }}
            aria-hidden
          />

          {/* Drag handle */}
          <button
            type="button"
            role="slider"
            aria-label="Drag to compare before and after"
            aria-valuenow={Math.round(position)}
            aria-valuemin={0}
            aria-valuemax={100}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              left: `${position}%`,
              cursor: "ew-resize",
              touchAction: "none",
              willChange: "left",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 100,
              padding: "7px 14px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: '"Inter", system-ui, sans-serif',
              whiteSpace: "nowrap",
              boxShadow: "0 2px 16px rgba(0,0,0,0.55)",
            }}
          >
            drag
          </button>
      </div>
    </div>
  );
}
