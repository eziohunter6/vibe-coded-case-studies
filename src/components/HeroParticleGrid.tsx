"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

const DOT         = 3;
const STEP        = 9;
const RADIUS      = 130;
const STRENGTH    = 60;
const LERP_CUR    = 0.11;   // cursor repulsion spring
const LERP_MORPH  = 0.032;  // morph transition spring (slow & smooth)

const HOLD_TEXT   = 3200;   // ms to hold text before morphing to icon
const HOLD_ICON   = 2400;   // ms to hold icon before morphing back
const MORPH_SETTLE = 1600;  // ms to let lerp settle after target change

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const cr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + cr, y);
  ctx.lineTo(x + w - cr, y);
  ctx.arcTo(x + w, y,         x + w, y + cr,     cr);
  ctx.lineTo(x + w, y + h - cr);
  ctx.arcTo(x + w, y + h,     x + w - cr, y + h, cr);
  ctx.lineTo(x + cr, y + h);
  ctx.arcTo(x,       y + h,   x,       y + h - cr, cr);
  ctx.lineTo(x, y + cr);
  ctx.arcTo(x,       y,       x + cr,  y,         cr);
  ctx.closePath();
}

function sampleCanvas(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
): { x: number; y: number }[] {
  const px = ctx.getImageData(0, 0, W, H).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += STEP) {
    for (let x = 0; x < W; x += STEP) {
      if (px[(y * W + x) * 4 + 3] > 128) pts.push({ x, y });
    }
  }
  return pts;
}

export function HeroParticleGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = containerRef.current;
    if (!el) return;

    const W = el.offsetWidth;
    const H = el.offsetHeight;

    const cv = document.createElement("canvas");
    cv.width  = W;
    cv.height = H;
    const ctx = cv.getContext("2d")!;

    const pagePad = W >= 640 ? 48 : 24;
    const maxTextW = W - pagePad - 16;
    // Position text in the upper ~36% of the hero, leaving generous space below
    const textY = Math.round(H * 0.36);

    // ── Sample "Utkarsh" text ────────────────────────────────────────────────
    let fs = Math.round(H * 0.44);
    ctx.font = `700 ${fs}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const rawW = ctx.measureText("Utkarsh").width;
    if (rawW > maxTextW) fs = Math.round(fs * (maxTextW / rawW));

    ctx.fillStyle = "#fff";
    ctx.font = `700 ${fs}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    ctx.textAlign   = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Utkarsh", pagePad, textY);

    const textHomes = sampleCanvas(ctx, W, H);
    if (!textHomes.length) return;

    // ── Sample fist-bump icon ────────────────────────────────────────────────
    // Draw two large rounded-rect "fists" side by side spanning the same
    // horizontal area as the text, so dot counts stay roughly matched.
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff";

    const textSpanW = ctx.measureText("Utkarsh").width; // with final fs
    const halfGap   = fs * 0.045;
    const fistW     = (textSpanW / 2) - halfGap;
    const fistH     = fs * 0.75;
    const fistR     = fistW * 0.2;
    const fistTop   = textY - fistH / 2;

    // Left fist
    roundRect(ctx, pagePad,                    fistTop, fistW, fistH, fistR);
    ctx.fill();
    // Right fist
    roundRect(ctx, pagePad + fistW + halfGap * 2, fistTop, fistW, fistH, fistR);
    ctx.fill();
    // Knuckle bump in the centre where the fists meet
    const bumpR = halfGap * 1.4;
    ctx.beginPath();
    ctx.arc(pagePad + fistW + halfGap, fistTop - bumpR * 0.2, bumpR, 0, Math.PI * 2);
    ctx.fill();

    const iconSampled = sampleCanvas(ctx, W, H);

    // ── Normalise icon count to match text count ────────────────────────────
    const N = textHomes.length;
    const iconHomes: { x: number; y: number }[] = [];
    if (iconSampled.length === 0) {
      const cx = pagePad + textSpanW / 2;
      for (let i = 0; i < N; i++) iconHomes.push({ x: cx, y: textY });
    } else {
      for (let i = 0; i < N; i++) iconHomes.push(iconSampled[i % iconSampled.length]);
    }

    // ── Build dot elements ───────────────────────────────────────────────────
    el.innerHTML = "";
    const dots: HTMLDivElement[] = [];
    const rSX: number[]  = [];
    const rSY: number[]  = [];

    // Per-dot state (all in pixel-offset space from each dot's home position)
    const curX = new Float32Array(N);  // cursor repulsion current
    const curY = new Float32Array(N);
    const curTX = new Float32Array(N); // cursor repulsion target
    const curTY = new Float32Array(N);
    const mphX = new Float32Array(N);  // morph current offset
    const mphY = new Float32Array(N);
    const mphTX = new Float32Array(N); // morph target offset (0 = text, icon-delta = icon)
    const mphTY = new Float32Array(N);

    textHomes.forEach(({ x, y }) => {
      const d  = document.createElement("div");
      const sx = (Math.random() - 0.5) * W * 1.4;
      const sy = (Math.random() - 0.5) * H * 1.4;
      rSX.push(sx);
      rSY.push(sy);
      d.style.cssText = [
        "position:absolute",
        `width:${DOT}px`,
        `height:${DOT}px`,
        "border-radius:50%",
        "background:var(--text)",
        "opacity:0",
        `left:${x - DOT / 2}px`,
        `top:${y - DOT / 2}px`,
        "will-change:transform,opacity",
      ].join(";");
      el.appendChild(d);
      dots.push(d);
    });

    // ── Entrance: scatter → text ─────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animate(dots, {
      translateX: (_el: any, i: number) => ({ from: rSX[i], to: 0 }),
      translateY: (_el: any, i: number) => ({ from: rSY[i], to: 0 }),
      opacity: [0, 0.85],
      delay:    stagger(0.8, { start: 0 }),
      duration: 320,
      ease:     "outExpo",
    });

    // ── Morph loop state machine ─────────────────────────────────────────────
    let loopTimers: ReturnType<typeof setTimeout>[] = [];
    let loopActive    = false;
    let cursorInHero  = false;

    const clearTimers = () => { loopTimers.forEach(clearTimeout); loopTimers = []; };

    const setTargetsText = () => {
      for (let i = 0; i < N; i++) { mphTX[i] = 0; mphTY[i] = 0; }
    };

    const setTargetsIcon = () => {
      for (let i = 0; i < N; i++) {
        mphTX[i] = iconHomes[i].x - textHomes[i].x;
        mphTY[i] = iconHomes[i].y - textHomes[i].y;
      }
    };

    const scheduleNext = () => {
      if (!loopActive || cursorInHero) return;
      const t1 = setTimeout(() => {
        if (!loopActive || cursorInHero) return;
        setTargetsIcon();
        const t2 = setTimeout(() => {
          if (!loopActive || cursorInHero) return;
          setTargetsText();
          const t3 = setTimeout(scheduleNext, MORPH_SETTLE);
          loopTimers.push(t3);
        }, HOLD_ICON + MORPH_SETTLE);
        loopTimers.push(t2);
      }, HOLD_TEXT);
      loopTimers.push(t1);
    };

    const startLoop = () => {
      if (loopActive) return;
      loopActive = true;
      scheduleNext();
    };

    const stopLoop = () => {
      loopActive = false;
      clearTimers();
    };

    // ── rAF: cursor repulsion + morph lerp ───────────────────────────────────
    let cx = -9999, cy = -9999;
    let rafId: number;
    let rafReady = false;

    // Wait until entrance is fully done before rAF starts writing transforms
    const enableTimer = setTimeout(() => {
      rafReady = true;
      startLoop();
    }, 700);

    const tick = () => {
      if (rafReady) {
        const rect = el.getBoundingClientRect();
        const lx   = cx - rect.left;
        const ly   = cy - rect.top;

        for (let i = 0; i < N; i++) {
          // ── cursor repulsion ──
          const hx   = textHomes[i].x;
          const hy   = textHomes[i].y;
          const dx   = hx - lx;
          const dy   = hy - ly;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < RADIUS && dist > 0) {
            const f    = (1 - dist / RADIUS) * STRENGTH / dist;
            curTX[i]   = dx * f;
            curTY[i]   = dy * f;
          } else {
            curTX[i] = 0;
            curTY[i] = 0;
          }

          curX[i] += (curTX[i] - curX[i]) * LERP_CUR;
          curY[i] += (curTY[i] - curY[i]) * LERP_CUR;

          // ── morph lerp ──
          mphX[i] += (mphTX[i] - mphX[i]) * LERP_MORPH;
          mphY[i] += (mphTY[i] - mphY[i]) * LERP_MORPH;

          dots[i].style.transform = `translate(${(curX[i] + mphX[i]).toFixed(1)}px,${(curY[i] + mphY[i]).toFixed(1)}px)`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // ── Mouse events ─────────────────────────────────────────────────────────
    const section = el.closest("section") ?? el;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!cursorInHero) {
        cursorInHero = true;
        stopLoop();
        setTargetsText(); // smoothly return to text while cursor is here
      }
    };

    const onLeave = () => {
      cx = -9999;
      cy = -9999;
      if (cursorInHero) {
        cursorInHero = false;
        // Brief pause, then restart the loop
        const t = setTimeout(() => { if (!cursorInHero) startLoop(); }, 900);
        loopTimers.push(t);
      }
    };

    section.addEventListener("mousemove", onMove as EventListener, { passive: true });
    section.addEventListener("mouseleave", onLeave);

    return () => {
      clearTimeout(enableTimer);
      stopLoop();
      cancelAnimationFrame(rafId);
      section.removeEventListener("mousemove", onMove as EventListener);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    />
  );
}
