"use client";

import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const FADE = 0.5; // seconds

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function tick() {
      if (!video || !video.duration) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = video.currentTime;
      const d = video.duration;

      if (t < FADE) {
        video.style.opacity = String(t / FADE);
      } else if (t > d - FADE) {
        video.style.opacity = String((d - t) / FADE);
      } else {
        video.style.opacity = "1";
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    function handleEnded() {
      if (!video) return;
      video.style.opacity = "0";
      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        video.play().catch(() => {});
      }, 100);
    }

    video.style.opacity = "0";
    rafRef.current = requestAnimationFrame(tick);
    video.addEventListener("ended", handleEnded);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0,
        }}
      />
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[var(--bg)] to-transparent" />
      {/* Bottom overlay, solid floor for the text region, video visible above it */}
      <div
        className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg) 0%, var(--bg) 45%, transparent 72%)" }}
      />
    </div>
  );
}
