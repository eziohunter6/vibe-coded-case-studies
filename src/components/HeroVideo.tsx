"use client";

import { useEffect, useRef, useState } from "react";

// Light theme → original video  |  Dark theme → new video
const VIDEOS = {
  light:
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4",
  dark: "/hero.mp4",
};

const FADE = 0.5; // seconds

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function HeroVideo() {
  const isDark = useIsDark();
  const src = isDark ? VIDEOS.dark : VIDEOS.light;

  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const prevSrc = useRef<string>("");

  // Fade-in / fade-out tick
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If src changed, reset and replay
    if (prevSrc.current !== src) {
      prevSrc.current = src;
      cancelAnimationFrame(rafRef.current);
      video.style.opacity = "0";
      video.load();
      video.play().catch(() => {});
    }

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
  }, [src]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          // Offset the video element 120px above the container so objectFit:cover
          // crops from 120px down — pulling the subject up toward the nav bar.
          // Height compensates so the bottom still fills the container.
          top: "-120px",
          right: 0,
          bottom: 0,
          left: 0,
          width: "100%",
          height: "calc(100% + 120px)",
          objectFit: "cover",
          objectPosition: "center center",
          opacity: 0,
        }}
      />
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[var(--bg)] to-transparent" />
      {/* Bottom overlay — solid floor for text, video visible above */}
      <div
        className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg) 0%, var(--bg) 45%, transparent 72%)" }}
      />
    </div>
  );
}
