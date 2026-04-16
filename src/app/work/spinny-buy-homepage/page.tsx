"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { WordSnap } from "@/components/WordSnap";
import Image from "next/image";
import Link from "next/link";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

// ─── Design tokens ───────────────────────────────────────────────────────────
const DARK = {
  bg: "#1a1a1a", card: "#242424", lite: "#2e2e2e",
  rule: "rgba(255,255,255,0.12)",
  w: "#ffffff", dim: "#cccccc", mut: "#999999",
  acc: "#ffffff", grn: "#4ade80", red: "#f87171", ylw: "#fbbf24",
} as const;

const LIGHT = {
  bg: "#f4f4f2", card: "#ffffff", lite: "#e8e8e6",
  rule: "rgba(0,0,0,0.1)",
  w: "#0f0f0f", dim: "#2c2c2c", mut: "#6b6b6b",
  acc: "#000000", grn: "#16a34a", red: "#dc2626", ylw: "#d97706",
} as const;

type Theme = { bg: string; card: string; lite: string; rule: string; w: string; dim: string; mut: string; acc: string; grn: string; red: string; ylw: string };
const ThemeCtx = createContext<Theme>(DARK);

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Sec({ children, id, cursorLabel }: { children: React.ReactNode; id?: string; cursorLabel?: string }) {
  const T = useContext(ThemeCtx);
  return (
    <section id={id} data-cursor-label={cursorLabel} style={{ borderBottom: `1px solid ${T.rule}`, padding: "clamp(40px, 8vw, 96px) 0 clamp(28px, 5vw, 56px)" }}>
      {children}
    </section>
  );
}

// ─── Section number ──────────────────────────────────────────────────────────
function Sn({ n }: { n: string }) {
  const T = useContext(ThemeCtx);
  return <p style={{ fontSize: 13, color: T.mut, marginBottom: 10, fontWeight: 400 }}>{n}</p>;
}

// ─── Section heading ─────────────────────────────────────────────────────────
function Sh({ children, tag = "h2", text }: { children?: React.ReactNode; tag?: "h1" | "h2"; text?: string }) {
  const T = useContext(ThemeCtx);
  const sharedStyle = { fontSize: "clamp(26px, 5.5vw, 72px)", fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.06, color: T.w };
  if (text) {
    return <WordSnap as={tag} text={text} delay={0.05} stagger={0.05} style={sharedStyle} />;
  }
  const Tag = tag;
  return (
    <Tag style={sharedStyle}>
      {children}
    </Tag>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Div() {
  const T = useContext(ThemeCtx);
  return <hr style={{ border: "none", borderTop: `1px solid ${T.rule}`, margin: "28px 0 40px" }} />;
}

// ─── Body text ───────────────────────────────────────────────────────────────
function B({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const T = useContext(ThemeCtx);
  return <p style={{ fontSize: 15, color: T.dim, lineHeight: 1.85, marginBottom: 18, maxWidth: 820, ...style }}>{children}</p>;
}

function Bl({ children }: { children: React.ReactNode }) {
  const T = useContext(ThemeCtx);
  return <p style={{ fontSize: 17, fontWeight: 500, color: T.w, lineHeight: 1.75, marginBottom: 20, maxWidth: 820 }}>{children}</p>;
}

// ─── Section image ───────────────────────────────────────────────────────────
function SectionImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const T = useContext(ThemeCtx);
  return (
    <div style={{ margin: "40px 0" }}>
      <div style={{ borderRadius: 6, overflow: "hidden", background: T.card, position: "relative", width: "100%", aspectRatio: "16/9" }}>
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="(max-width:768px) 100vw, 1100px" />
      </div>
      {caption && <p style={{ marginTop: 10, fontSize: 13, color: T.mut, lineHeight: 1.6 }}>{caption}</p>}
    </div>
  );
}

// ─── Hook: sync with existing site-wide theme toggle ────────────────────────
function useIsDark() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const update = () => setIsDark(!document.documentElement.classList.contains("light"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

// ─── Transaction states tabs + carousel ─────────────────────────────────────
const TD_SLIDES = [
  { src: "/images/buy-homepage/td-upcoming.png",  label: "Upcoming" },
  { src: "/images/buy-homepage/td-pending.png",   label: "Pending" },
  { src: "/images/buy-homepage/td-completed.png", label: "Completed" },
  { src: "/images/buy-homepage/td-cancelled.png", label: "Cancelled" },
];
const BK_SLIDES = [
  { src: "/images/buy-homepage/bk-confirmed.png",           label: "Confirmed" },
  { src: "/images/buy-homepage/bk-incomplete.png",          label: "Incomplete" },
  { src: "/images/buy-homepage/bk-delivery-scheduled.png",  label: "Delivery Scheduled" },
  { src: "/images/buy-homepage/bk-delivery-cancelled.png",  label: "Delivery Cancelled" },
];

function StatesSection() {
  const T = useContext(ThemeCtx);
  const [tab, setTab] = useState<"td" | "bk">("td");
  const slides = tab === "td" ? TD_SLIDES : BK_SLIDES;

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Section label */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        All transaction states
        <div style={{ flex: 1, height: 1, background: T.rule }} />
      </div>

      {/* Tab row — pill toggle */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          background: T.lite,
          borderRadius: 100,
          padding: 4,
        }}>
          {(["td", "bk"] as const).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: active ? "#ffffff" : "transparent",
                  color: active ? "#000000" : T.w,
                  borderRadius: 100,
                  padding: "7px 18px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s ease, color 0.2s ease",
                  fontFamily: '"Inter", system-ui, sans-serif',
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {t === "td" ? "Test Drive" : "Booking"}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-up horizontal grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        {slides.map((slide) => (
          <div key={slide.src}>
            <img
              src={slide.src}
              alt={slide.label}
              style={{ width: "100%", borderRadius: 20, display: "block" }}
            />
            <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: T.mut, textAlign: "center", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {slide.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BuyHomepagePage() {
  const isDark = useIsDark();
  const T = isDark ? DARK : LIGHT;
  const [slideTarget, setSlideTarget] = useState<{ pos: number; id: number } | null>(null);
  const [activeLabel, setActiveLabel] = useState<"before" | "after">("before");
  const tbl = {
    labelBg:      isDark ? "#111111" : "#ececea",
    buyerBg:      isDark ? "#1e0a12" : "#fff0f2",
    labelColor:   isDark ? "#505050" : "#888888",
    browserColor: isDark ? "#404040" : "#666666",
    chipBg:       isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
    chipBorder:   isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.1)",
    divider:      isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
  };

  return (
    <ThemeCtx.Provider value={T}>
    <article style={{ background: T.bg, color: T.w, fontFamily: '"Inter", system-ui, sans-serif', fontSize: 16, lineHeight: 1.65, WebkitFontSmoothing: "antialiased", colorScheme: isDark ? "dark" : "light", cursor: isDark ? "auto" : "default" }}>
      <ScrollProgressBar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 5vw, 60px)" }}>

        {/* ── 01 HERO ─────────────────────────────────────────────────────── */}
        <Sec id="hero">
          <Reveal>
            <Sn n="01." />
            <Sh tag="h1" text="Redesigning Spinny's homepage for committed buyers" />
            <Div />
            <Bl>
              After booking a test drive, users returned to the exact same homepage as a first-time visitor.
              No booking detail. No next step. No acknowledgement they&apos;d said yes.
              The homepage was losing people it had already won.
            </Bl>

            {/* Meta row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", marginTop: 44, borderTop: `1px solid ${T.rule}`, gap: 1, background: T.rule }}>
              {[
                { label: "Role", value: "Lead Designer" },
                { label: "Team", value: "1 PM · 3 Eng · 1 Analyst" },
                { label: "Platform", value: "iOS · Android · PWA" },
                { label: "Timeline", value: "4 Weeks · 2025" },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{ padding: "20px", background: T.bg }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.mut, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.w }}>{m.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Sec>

        {/* ── BEFORE / AFTER ──────────────────────────────────────────────── */}
        <Sec id="before-after" cursorLabel="spot the difference.">
          <div style={{
            maxWidth: 740,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(32px, 5vw, 56px)",
            alignItems: "flex-start",
          }}>
            {/* Left: toggle + contextual copy */}
            <div style={{ flex: "1 1 200px", minWidth: 0 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                background: isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)",
                borderRadius: 100,
                padding: 4,
                marginBottom: 28,
              }}>
                <button
                  onClick={() => { setActiveLabel("before"); setSlideTarget({ pos: 88, id: Date.now() }); }}
                  style={{
                    background: activeLabel === "before" ? "#ffffff" : "transparent",
                    color: activeLabel === "before" ? "#000000" : T.w,
                    borderRadius: 100,
                    padding: "7px 18px",
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s ease, color 0.2s ease",
                    fontFamily: '"Inter", system-ui, sans-serif',
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                  }}
                >Before</button>
                <button
                  onClick={() => { setActiveLabel("after"); setSlideTarget({ pos: 12, id: Date.now() }); }}
                  style={{
                    background: activeLabel === "after" ? "#ffffff" : "transparent",
                    color: activeLabel === "after" ? "#000000" : T.w,
                    borderRadius: 100,
                    padding: "7px 18px",
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s ease, color 0.2s ease",
                    fontFamily: '"Inter", system-ui, sans-serif',
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                  }}
                >After</button>
              </div>
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: T.mut,
                marginBottom: 12,
                fontFamily: '"Inter", system-ui, sans-serif',
              }}>
                {activeLabel === "before" ? "The problem" : "The fix"}
              </p>
              <p style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: T.w,
                fontFamily: '"Inter", system-ui, sans-serif',
                transition: "opacity 0.25s ease",
              }}>
                {activeLabel === "before"
                  ? "A returning buyer with a test drive booked landed on the same homepage as a first-time visitor. The product had the data. The page never looked at it."
                  : "State-aware from the first scroll. Committed buyers see their stage, RM details, and one clear next action. The homepage becomes a co-pilot."}
              </p>
            </div>
            {/* Right: slider */}
            <div style={{ flex: "1 1 280px", maxWidth: 380 }}>
              <Reveal delay={0.05}>
                <BeforeAfterSlider
                  beforeSrc="/images/buy-homepage/slider-before.png"
                  afterSrc="/images/buy-homepage/slider-after.png"
                  beforeAlt="Spinny Buy Homepage — before redesign"
                  afterAlt="Spinny Buy Homepage — after redesign"
                  imgW={770}
                  imgH={1552}
                  targetPos={slideTarget}
                  onPositionChange={(p) => setActiveLabel(p > 50 ? "before" : "after")}
                />
              </Reveal>
            </div>
          </div>
        </Sec>

        {/* ── 02 PROBLEM ─────────────────────────────────────────────────── */}
        <Sec id="problem" cursorLabel="two users, one page">
          <Reveal>
            <Sn n="02." />
            <Sh text="Problem" />
            <Div />
            <h3 style={{ fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 700, letterSpacing: -1, color: T.w, marginBottom: 28, lineHeight: 1.1 }}>
              Two users. One homepage.<br />A product blind to the difference.
            </h3>
            <B>
              Spinny&apos;s homepage was designed for discovery, browsing, filtering, comparing.
              It served exploratory users well. But a large cohort of returning users had already committed.
              They&apos;d scheduled a test drive, made a booking, or were waiting on delivery.
              For them, the homepage showed nothing relevant.
            </B>
            <div style={{ margin: "28px 0", padding: "24px 32px", background: T.card, borderLeft: `3px solid ${T.acc}` }}>
              <p style={{ fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 500, lineHeight: 1.6, color: T.w, margin: 0 }}>
                &ldquo;A user who just booked a test drive returns to the app and sees the same homepage as someone who has never heard of Spinny.&rdquo;
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            {/* Browser vs Buyer table, Figma design */}
            <table className="cmp-compare" style={{ width: "100%", borderCollapse: "collapse", margin: "32px 0", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ width: 140, padding: "16px 20px", background: tbl.labelBg, border: `1px solid ${T.rule}`, textAlign: "left" }} />
                  <th style={{ padding: "16px 20px", background: tbl.labelBg, border: `1px solid ${T.rule}`, textAlign: "left", fontSize: 15, fontWeight: 500, color: tbl.labelColor, fontStyle: "normal" }}>
                    The browser
                  </th>
                  <th style={{ padding: "16px 20px", background: tbl.buyerBg, borderTop: "1px solid rgba(200,60,80,0.25)", borderRight: "1px solid rgba(200,60,80,0.25)", borderBottom: "1px solid rgba(200,60,80,0.25)", borderLeft: "2px solid #c83c50", textAlign: "left" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: T.w }}>The Buyer</span>
                    <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, background: isDark ? "rgba(249,150,165,0.18)" : "#c83c50", color: isDark ? "#f9a8b8" : "#ffffff", border: isDark ? "1px solid rgba(249,150,165,0.35)" : "none", padding: "2px 10px", borderRadius: 100, marginLeft: 10, verticalAlign: "middle" }}>
                      The Gap
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "STATE",        browser: "Browsing inventory. No commitment yet.",    buyer: "Test drive booked. Returning for next step." },
                  { label: "GOAL",         browser: "Find the right car",                        buyer: "What do I do now?" },
                  { label: "HOMEPAGE FIT", browser: "Works perfectly, built for this user",     buyer: "Shows nothing relevant. Booking invisible." },
                  { label: "INTENT",       browser: "Exploratory · low commitment",              buyer: "Highest intent · completely ignored" },
                ].map((row, i) => (
                  <tr key={row.label} style={{ borderTop: i === 0 ? "none" : `1px solid ${T.rule}` }}>
                    <td data-label="" style={{ fontSize: 10, fontWeight: 700, color: tbl.labelColor, letterSpacing: "0.08em", textTransform: "uppercase", background: tbl.labelBg, whiteSpace: "nowrap", padding: "18px 20px", border: `1px solid ${T.rule}`, verticalAlign: "middle" }}>
                      {row.label}
                    </td>
                    <td data-label="Browser" style={{ padding: "18px 20px", border: `1px solid ${T.rule}`, color: T.dim, verticalAlign: "middle", lineHeight: 1.6, fontSize: 13 }}>
                      {row.browser}
                    </td>
                    <td data-label="Buyer" style={{ padding: "18px 20px", background: tbl.buyerBg, borderTop: "1px solid rgba(200,60,80,0.18)", borderRight: "1px solid rgba(200,60,80,0.18)", borderBottom: "1px solid rgba(200,60,80,0.18)", borderLeft: "2px solid #c83c50", color: T.w, verticalAlign: "middle", lineHeight: 1.6, fontSize: 13 }}>
                      {row.buyer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: 6, marginBottom: 18, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
              Two cohorts, one homepage, committed buyers were invisible to the product.
            </p>

            <B>
              Drop-offs peaked in the 48-hour gap between scheduling and showroom visit.
              The data pointed to a continuity problem, not a UI problem.
            </B>
          </Reveal>

        </Sec>

        {/* ── 03 JOURNEY ────────────────────────────────────────────────── */}
        <Sec id="journey" cursorLabel="where intent went cold">
          <Reveal>
            <Sn n="03." />
            <Sh text="Where the journey broke down" />
            <Div />
            <B>
              I mapped the transactional lifecycle to locate exactly where committed users were being dropped.
              The friction wasn&apos;t in booking, it was in the void immediately after.
            </B>
          </Reveal>

          <Reveal delay={0.05}>
            {/* Lifecycle diagram, Figma design */}
            <div style={{ margin: "40px 0 24px", background: isDark ? "#141414" : "#e8e8e6", borderRadius: 12, padding: "40px 32px 36px", overflowX: "auto" }}>
              {/* Stage track */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, position: "relative", minWidth: 520 }}>
                {/* Connecting line, top: 34px spacer + 28px (half of 56px icon) = 62 */}
                <div style={{ position: "absolute", top: 62, left: "12.5%", right: "12.5%", height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)", zIndex: 0 }} />

                {/* Stage 1, Test Drive Scheduled */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1, padding: "0 8px" }}>
                  {/* Header zone, empty spacer */}
                  <div style={{ height: 34 }} />
                  <svg width="56" height="56" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 14 }}>
                    <rect width="72" height="72" rx="36" fill="#434343"/>
                    <mask id="mask_td" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="16" y="16" width="40" height="40">
                      <rect x="16" y="16" width="40" height="40" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask_td)">
                      <path d="M24.0281 51.7698C23.1819 51.7698 22.4657 51.479 21.8794 50.8973C21.2931 50.3155 21 49.6049 21 48.7653V26.5201C21 25.6805 21.2931 24.9698 21.8794 24.3881C22.4657 23.8064 23.1819 23.5156 24.0281 23.5156H26.3473V21.2781C26.3473 20.9138 26.4703 20.6097 26.7162 20.3656C26.9622 20.1219 27.2687 20 27.6359 20C28.0033 20 28.3098 20.1219 28.5555 20.3656C28.8014 20.6097 28.9244 20.9138 28.9244 21.2781V23.5156H41.6166V21.2465C41.6166 20.8928 41.7368 20.5965 41.9771 20.3577C42.2178 20.1192 42.5164 20 42.8729 20C43.2294 20 43.5278 20.1192 43.7682 20.3577C44.0089 20.5965 44.1292 20.8928 44.1292 21.2465V23.5156H46.4484C47.2946 23.5156 48.0108 23.8064 48.5971 24.3881C49.1834 24.9698 49.4765 25.6805 49.4765 26.5201V37.2912C49.4765 37.6449 49.3562 37.941 49.1155 38.1795C48.8752 38.4183 48.5767 38.5377 48.2202 38.5377C47.8637 38.5377 47.5652 38.4183 47.3249 38.1795C47.0842 37.941 46.9639 37.6449 46.9639 37.2912V33.1681H23.5126V48.7653C23.5126 48.8933 23.5664 49.0105 23.6739 49.1168C23.7811 49.2235 23.8992 49.2768 24.0281 49.2768H34.2462C34.6027 49.2768 34.8968 49.3962 35.1285 49.635C35.3605 49.8735 35.4765 50.1696 35.4765 50.5233C35.4765 50.877 35.3563 51.1731 35.116 51.4116C34.8753 51.6504 34.5767 51.7698 34.2202 51.7698H24.0281ZM23.5126 30.6751H46.9639V26.5201C46.9639 26.3921 46.9101 26.2749 46.8026 26.1686C46.6954 26.0619 46.5773 26.0086 46.4484 26.0086H24.0281C23.8992 26.0086 23.7811 26.0619 23.6739 26.1686C23.5664 26.2749 23.5126 26.3921 23.5126 26.5201V30.6751ZM42.7699 49.0882L48.845 43.0604C49.0943 42.8131 49.3859 42.6868 49.7198 42.6815C50.0537 42.6762 50.3506 42.8026 50.6105 43.0604C50.8702 43.3181 51 43.6142 51 43.9488C51 44.2834 50.8702 44.5795 50.6105 44.8371L43.8553 51.5492C43.5524 51.8497 43.1948 52 42.7824 52C42.3701 52 42.0126 51.8497 41.71 51.5492L38.4079 48.2891C38.1483 48.0421 38.0185 47.7486 38.0185 47.4087C38.0185 47.0688 38.1483 46.7699 38.4079 46.512C38.6679 46.2541 38.9664 46.1252 39.3037 46.1252C39.6407 46.1252 39.9391 46.2541 40.199 46.512L42.7699 49.0882Z" fill="white"/>
                    </g>
                  </svg>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.w, marginBottom: 6 }}>Test Drive Scheduled</div>
                  <div style={{ fontSize: 11, color: T.mut, lineHeight: 1.6 }}>User Commits · Intent at peak · Slot Confirmed</div>
                </div>

                {/* Stage 2, The Void (Problem Space) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1, padding: "0 8px" }}>
                  {/* 34px spacer, keeps icon at same Y as all stages, adds gap below pill */}
                  <div style={{ height: 34 }} />
                  {/* Icon at exact same Y as other stages */}
                  <svg width="56" height="56" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 14 }}>
                    <rect x="1" y="1" width="70" height="70" rx="35" fill="#FFCECE"/>
                    <rect x="1" y="1" width="70" height="70" rx="35" stroke="#BE4444" strokeWidth="2"/>
                    <mask id="mask_ps" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="16" y="17" width="40" height="40">
                      <rect x="16" y="17" width="40" height="40" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask_ps)">
                      <path d="M41.9965 36.6076L39.787 34.3984H41.2685C41.6189 34.3984 41.9121 34.5166 42.1484 34.7531C42.3848 34.9893 42.5031 35.2825 42.5031 35.6328C42.5031 35.8438 42.4588 36.0326 42.3702 36.1994C42.2816 36.3662 42.157 36.5023 41.9965 36.6076ZM50.6387 51.6424C50.4002 51.8808 50.1112 52 49.7716 52C49.4316 52 49.1425 51.8808 48.9041 51.6424L20.35 23.0923C20.1223 22.8644 20.0057 22.578 20.0002 22.2332C19.995 21.8881 20.1116 21.5964 20.35 21.358C20.5887 21.1193 20.8778 21 21.2175 21C21.5571 21 21.8463 21.1193 22.085 21.358L50.6387 49.9077C50.8666 50.1356 50.9832 50.4221 50.9885 50.7672C50.9939 51.112 50.8773 51.4038 50.6387 51.6424ZM28.1946 43.1027C26.1284 43.1027 24.3668 42.3741 22.9097 40.917C21.4523 39.4601 20.7236 37.6987 20.7236 35.6328C20.7236 33.8034 21.313 32.1981 22.4916 30.8169C23.6702 29.436 25.1491 28.6021 26.9283 28.3152H27.3081L29.6255 30.6318H28.1946C26.8121 30.6318 25.6329 31.1198 24.6571 32.0958C23.6809 33.0718 23.1928 34.2508 23.1928 35.6328C23.1928 37.0148 23.6809 38.1938 24.6571 39.1698C25.6329 40.1459 26.8121 40.6339 28.1946 40.6339H33.1963C33.5467 40.6339 33.84 40.752 34.0762 40.9881C34.3127 41.2246 34.4309 41.518 34.4309 41.8683C34.4309 42.2186 34.3127 42.5118 34.0762 42.748C33.84 42.9845 33.5467 43.1027 33.1963 43.1027H28.1946ZM31.4551 36.8672C31.1048 36.8672 30.8115 36.749 30.5753 36.5125C30.3388 36.2764 30.2205 35.9831 30.2205 35.6328C30.2205 35.2825 30.3388 34.9893 30.5753 34.7531C30.8115 34.5166 31.1048 34.3984 31.4551 34.3984H33.4177L35.8458 36.8672H31.4551ZM46.7925 41.5708C46.6089 41.2817 46.5489 40.9705 46.6122 40.6372C46.6753 40.3036 46.8568 40.0503 47.1567 39.8772C47.8826 39.432 48.4597 38.8375 48.888 38.0938C49.3165 37.3499 49.5308 36.5296 49.5308 35.6328C49.5308 34.2508 49.0455 33.0718 48.0748 32.0958C47.1039 31.1198 45.9325 30.6318 44.5608 30.6318H39.5273C39.177 30.6318 38.8837 30.5137 38.6475 30.2775C38.411 30.041 38.2927 29.7477 38.2927 29.3974C38.2927 29.0471 38.411 28.7538 38.6475 28.5176C38.8837 28.2812 39.177 28.1629 39.5273 28.1629H44.5608C46.6162 28.1629 48.37 28.8915 49.8222 30.3487C51.2741 31.8056 52 33.5669 52 35.6328C52 36.9347 51.6834 38.1369 51.0502 39.2394C50.417 40.3421 49.5622 41.2353 48.4859 41.9189C48.197 42.1024 47.8884 42.1625 47.56 42.0991C47.2319 42.036 46.976 41.8599 46.7925 41.5708Z" fill="#BE4444"/>
                    </g>
                  </svg>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e05870", marginBottom: 6 }}>Problem Space</div>
                  <div style={{ fontSize: 11, color: isDark ? "#c07080" : "#b03050", lineHeight: 1.6 }}>Returns to app · The homepage shows nothing relevant · No Next step</div>
                  {/* Red box, absolute overlay behind content, starts above icon so badge sits on its top edge */}
                  <div style={{ position: "absolute", top: 12, left: -6, right: -6, bottom: -4, border: "1.5px solid rgba(200,60,80,0.55)", borderRadius: 14, background: "rgba(180,30,50,0.08)", zIndex: -1, pointerEvents: "none" }} />
                  {/* "The Void" white pill badge, centered on the box's top border */}
                  <div style={{ position: "absolute", top: 1, left: "50%", transform: "translateX(-50%)", background: isDark ? "#f5f5f5" : "#1a1a1a", color: isDark ? "#111111" : "#ffffff", fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 100, whiteSpace: "nowrap", zIndex: 2, letterSpacing: "0.01em" }}>
                    The Void
                  </div>
                </div>

                {/* Stage 3, Showroom Visit */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1, padding: "0 8px" }}>
                  {/* Header zone, empty spacer */}
                  <div style={{ height: 34 }} />
                  <svg width="56" height="56" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 14 }}>
                    <path d="M0 36C0 16.1177 16.1177 0 36 0V0C55.8823 0 72 16.1177 72 36V36C72 55.8823 55.8823 72 36 72V72C16.1177 72 0 55.8823 0 36V36Z" fill="#434343"/>
                    <mask id="mask_sv" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="16" y="16" width="40" height="40">
                      <rect x="16" y="16" width="40" height="40" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask_sv)">
                      <path d="M31.8333 24.9105C30.9872 24.9105 30.2629 24.6091 29.6604 24.0063C29.0576 23.4038 28.7563 22.6795 28.7563 21.8334C28.7563 20.9873 29.0576 20.263 29.6604 19.6605C30.2629 19.0577 30.9872 18.7563 31.8333 18.7563C32.6794 18.7563 33.4038 19.0577 34.0063 19.6605C34.609 20.263 34.9104 20.9873 34.9104 21.8334C34.9104 22.6795 34.609 23.4038 34.0063 24.0063C33.4038 24.6091 32.6794 24.9105 31.8333 24.9105ZM27.1921 40.1988L24.3588 52.9201C24.2974 53.2107 24.1489 53.4494 23.9133 53.6363C23.6778 53.8233 23.4064 53.9168 23.0992 53.9168C22.6797 53.9168 22.3442 53.7619 22.0925 53.4522C21.8406 53.1422 21.7596 52.7927 21.8496 52.4038L26.1604 30.1284L22.25 31.7788V36.0001C22.25 36.3543 22.1301 36.6511 21.8904 36.8905C21.6507 37.1302 21.3538 37.2501 20.9996 37.2501C20.6451 37.2501 20.3483 37.1302 20.1092 36.8905C19.8697 36.6511 19.75 36.3543 19.75 36.0001V31.1026C19.75 30.8004 19.8382 30.5234 20.0146 30.2718C20.1912 30.0201 20.4182 29.8312 20.6954 29.7051L27.9713 26.7147C28.7213 26.4091 29.4504 26.3532 30.1588 26.5468C30.8671 26.7401 31.4189 27.1711 31.8142 27.8397L33.4133 30.4905C34.0458 31.4947 34.8725 32.3694 35.8933 33.1147C36.9142 33.86 38.0608 34.3495 39.3333 34.5834C39.6875 34.6673 39.9843 34.8297 40.2238 35.0705C40.4635 35.3113 40.5833 35.6098 40.5833 35.9659C40.5833 36.322 40.4636 36.6127 40.2242 36.838C39.985 37.0636 39.6881 37.1538 39.3333 37.1088C37.705 36.8655 36.2403 36.3079 34.9392 35.4359C33.6378 34.5643 32.5501 33.5055 31.6763 32.2597L30.4358 38.5259L33.0383 41.0963C33.3225 41.3697 33.54 41.6905 33.6908 42.0588C33.8414 42.4275 33.9167 42.815 33.9167 43.2213V52.6668C33.9167 53.0209 33.7968 53.3177 33.5571 53.5572C33.3174 53.7969 33.0204 53.9168 32.6663 53.9168C32.3118 53.9168 32.015 53.7969 31.7758 53.5572C31.5364 53.3177 31.4167 53.0209 31.4167 52.6668V44.1893L27.1921 40.1988ZM44.1729 30.7438H39.4296C39.0026 30.7438 38.6449 30.5994 38.3563 30.3105C38.0674 30.0219 37.9229 29.6641 37.9229 29.2372V21.0963C37.9229 20.6694 38.0674 20.3116 38.3563 20.023C38.6449 19.7341 39.0026 19.5897 39.4296 19.5897H50.9038C51.3307 19.5897 51.6885 19.7341 51.9771 20.023C52.266 20.3116 52.4104 20.6694 52.4104 21.0963V29.2372C52.4104 29.6641 52.266 30.0219 51.9771 30.3105C51.6885 30.5994 51.3307 30.7438 50.9038 30.7438H46.1604V53.0834C46.1604 53.3704 46.0665 53.6077 45.8788 53.7955C45.6913 53.9833 45.4542 54.0772 45.1675 54.0772C44.8806 54.0772 44.6431 53.9833 44.455 53.7955C44.2669 53.6077 44.1729 53.3704 44.1729 53.0834V30.7438ZM45.9583 26.1605L45.3175 26.8013C45.1208 26.998 45.0199 27.2283 45.0146 27.4922C45.009 27.7561 45.11 27.9916 45.3175 28.1988C45.5247 28.4061 45.7618 28.5097 46.0288 28.5097C46.296 28.5097 46.5332 28.4061 46.7404 28.1988L48.7438 26.2213C48.8996 26.0652 49.0096 25.9 49.0738 25.7255C49.1379 25.5511 49.17 25.3641 49.17 25.1647C49.17 24.9652 49.1379 24.779 49.0738 24.6059C49.0096 24.4329 48.8996 24.2683 48.7438 24.1122L46.7404 22.1093C46.5438 21.9126 46.3135 21.8116 46.0496 21.8063C45.7857 21.8008 45.5501 21.9018 45.3429 22.1093C45.1357 22.3165 45.0321 22.5536 45.0321 22.8205C45.0321 23.0877 45.1357 23.325 45.3429 23.5322L45.9583 24.173H41.4167C41.1297 24.173 40.8924 24.2669 40.7046 24.4547C40.5168 24.6422 40.4229 24.8793 40.4229 25.1659C40.4229 25.4529 40.5168 25.6904 40.7046 25.8784C40.8924 26.0665 41.1297 26.1605 41.4167 26.1605H45.9583Z" fill="white"/>
                    </g>
                  </svg>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.w, marginBottom: 6 }}>Showroom Visit</div>
                  <div style={{ fontSize: 11, color: T.mut, lineHeight: 1.6 }}>Arrives · Inspects · Moves towards booking</div>
                </div>

                {/* Stage 4, Booking & Delivery */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1, padding: "0 8px" }}>
                  {/* Header zone, empty spacer */}
                  <div style={{ height: 34 }} />
                  <svg width="56" height="56" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 14 }}>
                    <rect width="72" height="72" rx="36" fill="#434343"/>
                    <mask id="mask_bd" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="16" y="16" width="40" height="40">
                      <rect x="16" y="16" width="40" height="40" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask_bd)">
                      <path d="M29.9733 27.4742C28.8197 27.4742 27.8369 27.0682 27.025 26.2563C26.2128 25.4443 25.8066 24.4614 25.8066 23.3075C25.8066 22.1539 26.2128 21.1711 27.025 20.3592C27.8369 19.547 28.8197 19.1409 29.9733 19.1409C30.965 19.1409 31.8326 19.4588 32.5762 20.0946C33.3198 20.7302 33.8219 21.5234 34.0825 22.4742H46.1916V24.1409H44.525V27.4742H42.8583V24.1409H34.0825C33.8219 25.092 33.3198 25.8853 32.5762 26.5209C31.8326 27.1564 30.965 27.4742 29.9733 27.4742ZM31.7379 25.0721C32.2282 24.5818 32.4733 23.9936 32.4733 23.3075C32.4733 22.6217 32.2282 22.0336 31.7379 21.5434C31.2476 21.0528 30.6594 20.8075 29.9733 20.8075C29.2875 20.8075 28.6994 21.0528 28.2091 21.5434C27.7186 22.0336 27.4733 22.6217 27.4733 23.3075C27.4733 23.9936 27.7186 24.5818 28.2091 25.0721C28.6994 25.5624 29.2875 25.8075 29.9733 25.8075C30.6594 25.8075 31.2476 25.5624 31.7379 25.0721ZM31.2571 43.8221C31.5123 43.5668 31.64 43.2671 31.64 42.923C31.64 42.5791 31.5123 42.2795 31.2571 42.0242C31.0018 41.7686 30.7022 41.6409 30.3583 41.6409C30.0141 41.6409 29.7144 41.7686 29.4591 42.0242C29.2039 42.2795 29.0762 42.5791 29.0762 42.923C29.0762 43.2671 29.2039 43.5668 29.4591 43.8221C29.7144 44.0774 30.0141 44.205 30.3583 44.205C30.7022 44.205 31.0018 44.0774 31.2571 43.8221ZM42.5391 43.8221C42.7944 43.5668 42.9221 43.2671 42.9221 42.923C42.9221 42.5791 42.7944 42.2795 42.5391 42.0242C42.2839 41.7686 41.9841 41.6409 41.64 41.6409C41.2961 41.6409 40.9965 41.7686 40.7412 42.0242C40.4859 42.2795 40.3583 42.5791 40.3583 42.923C40.3583 43.2671 40.4859 43.5668 40.7412 43.8221C40.9965 44.0774 41.2961 44.205 41.64 44.205C41.9841 44.205 42.2839 44.0774 42.5391 43.8221ZM25.9991 40.013L28.4929 32.8463C28.5676 32.6068 28.7005 32.4209 28.8916 32.2884C29.083 32.1559 29.2983 32.0896 29.5375 32.0896H42.4608C42.7 32.0896 42.9153 32.1559 43.1066 32.2884C43.2978 32.4209 43.4307 32.6068 43.5054 32.8463L45.9991 40.013V49.6667C45.9991 49.8848 45.9276 50.0653 45.7846 50.2084C45.6412 50.3514 45.4607 50.423 45.2429 50.423H45.0887C44.8709 50.423 44.6904 50.3514 44.5471 50.2084C44.404 50.0653 44.3325 49.8848 44.3325 49.6667V47.0896H27.6658V49.6667C27.6658 49.8848 27.5943 50.0653 27.4512 50.2084C27.3079 50.3514 27.1273 50.423 26.9096 50.423H26.7554C26.5376 50.423 26.3571 50.3514 26.2137 50.2084C26.0707 50.0653 25.9991 49.8848 25.9991 49.6667V40.013ZM28.1721 38.7563H43.8262L42.0825 33.7563H29.9158L28.1721 38.7563ZM27.6658 45.423H44.3325V40.423H27.6658V45.423Z" fill="white"/>
                    </g>
                  </svg>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.w, marginBottom: 6 }}>Booking &amp; Delivery</div>
                  <div style={{ fontSize: 11, color: T.mut, lineHeight: 1.6 }}>Slot Paid · Awaiting delivery · Due RC Transfer</div>
                </div>
              </div>

              {/* 48h annotation */}
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${tbl.divider}` }}>
                <div style={{ fontSize: 52, fontWeight: 800, color: "#e05870", lineHeight: 1, marginBottom: 12, letterSpacing: -2 }}>48h</div>
                <p style={{ fontSize: 13, color: T.mut, lineHeight: 1.7, maxWidth: 760, margin: 0 }}>
                  Average gap between when <span style={{ color: T.w }}>test drive was scheduled</span> to when the user would visit the Hub for the test drive spot. In the entire time window there is <span style={{ color: T.w }}>no affordance to the upcoming task</span> or updates on the user action, which then was shown in data as <span style={{ color: "#e05870" }}>Peak drop off</span> point.
                </p>
              </div>
            </div>

            <p style={{ marginTop: 16, marginBottom: 18, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
              User lifecycle mapped across four stages, the 48-hour void between Test Drive Scheduled and Showroom Visit had zero product support.
            </p>

            <B style={{ marginTop: 24 }}>
              Every stage after scheduling depended on the user remembering what to do next without the product telling them.
              That&apos;s not a feature gap, that&apos;s a trust gap.
            </B>
          </Reveal>

        </Sec>

        {/* ── 04 COMPETITIVE ────────────────────────────────────────────── */}
        <Sec id="competitive" cursorLabel="nobody solved this">
          <Reveal>
            <Sn n="04." />
            <Sh text="Nobody had solved this." />
            <Div />
            <B>
              Before designing, I audited how competitors handle returning committed users.
              The finding shaped the framing of the opportunity.
            </B>
          </Reveal>

          <Reveal delay={0.05}>
            {/* Competitive audit table, Figma design */}
            <table className="cmp-audit" style={{ width: "100%", borderCollapse: "collapse", margin: "32px 0", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ width: 160, padding: "12px 18px", background: T.card, border: `1px solid ${T.rule}`, textAlign: "left", fontSize: 12, fontWeight: 600, color: T.mut, letterSpacing: "0.05em", textTransform: "uppercase" }}>Platform</th>
                  <th style={{ padding: "12px 18px", background: T.card, border: `1px solid ${T.rule}`, textAlign: "left", fontSize: 12, fontWeight: 600, color: T.mut, letterSpacing: "0.05em", textTransform: "uppercase" }}>Post-booking homepage</th>
                  <th style={{ width: 220, padding: "12px 18px", background: T.card, border: `1px solid ${T.rule}`, textAlign: "left", fontSize: 12, fontWeight: 600, color: T.mut, letterSpacing: "0.05em", textTransform: "uppercase" }}>State awareness</th>
                  <th style={{ width: 100, padding: "12px 18px", background: T.card, border: `1px solid ${T.rule}`, textAlign: "left", fontSize: 12, fontWeight: 600, color: T.mut, letterSpacing: "0.05em", textTransform: "uppercase" }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {/* Cars 24 */}
                <tr>
                  <td data-label="" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.w }}>Cars 24</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.mut, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3 }}>Indian Market</div>
                  </td>
                  <td data-label="Post-booking" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, color: T.dim, verticalAlign: "top", lineHeight: 1.65, fontSize: 13 }}>
                    Dashboard widget with delivery tracker but only visible when logged in.
                  </td>
                  <td data-label="State awareness" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["Conditional", "Anonymous", "Users sees nothing"].map(c => (
                        <span key={c} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: tbl.chipBg, color: T.mut, border: `1px solid ${tbl.chipBorder}` }}>{c}</span>
                      ))}
                    </div>
                  </td>
                  <td data-label="Verdict" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(251,191,36,0.12)", color: T.ylw, border: "1px solid rgba(251,191,36,0.3)" }}>Partial</span>
                  </td>
                </tr>
                {/* Car Dekho */}
                <tr>
                  <td data-label="" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.w }}>Car Dekho</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.mut, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3 }}>Indian Market</div>
                  </td>
                  <td data-label="Post-booking" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, color: T.dim, verticalAlign: "top", lineHeight: 1.65, fontSize: 13 }}>
                    Generic inventory homepage. Identical to a first visit. No booking state.
                  </td>
                  <td data-label="State awareness" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: tbl.chipBg, color: T.mut, border: `1px solid ${tbl.chipBorder}` }}>None</span>
                  </td>
                  <td data-label="Verdict" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(248,113,113,0.12)", color: T.red, border: "1px solid rgba(248,113,113,0.3)" }}>None</span>
                  </td>
                </tr>
                {/* CarWale */}
                <tr>
                  <td data-label="" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.w }}>CarWale</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.mut, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3 }}>Indian Market</div>
                  </td>
                  <td data-label="Post-booking" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, color: T.dim, verticalAlign: "top", lineHeight: 1.65, fontSize: 13 }}>
                    Category filters and listings. Transactional intent invisible to the interface.
                  </td>
                  <td data-label="State awareness" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: tbl.chipBg, color: T.mut, border: `1px solid ${tbl.chipBorder}` }}>None</span>
                  </td>
                  <td data-label="Verdict" style={{ padding: "16px 18px", border: `1px solid ${T.rule}`, verticalAlign: "top" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(248,113,113,0.12)", color: T.red, border: "1px solid rgba(248,113,113,0.3)" }}>None</span>
                  </td>
                </tr>
                {/* Spinny */}
                <tr style={{ background: "rgba(91,123,255,0.05)" }}>
                  <td data-label="" style={{ padding: "16px 18px", border: "1px solid rgba(91,123,255,0.2)", verticalAlign: "top" }}>
                    <svg width="81" height="32" viewBox="0 0 102 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Diamond dots and inner S, white on red, fine in both modes */}
                      <path d="M27.9483 19.0205C27.7538 19.0204 27.5637 19.078 27.402 19.186C27.2403 19.294 27.1142 19.4475 27.0398 19.6271C26.9653 19.8067 26.9458 20.0044 26.9837 20.1951C27.0216 20.3858 27.1152 20.561 27.2526 20.6985C27.3901 20.8361 27.5653 20.9297 27.756 20.9677C27.9467 21.0057 28.1444 20.9862 28.324 20.9118C28.5037 20.8374 28.6572 20.7114 28.7652 20.5498C28.8733 20.3881 28.9309 20.198 28.9309 20.0036C28.931 19.8745 28.9056 19.7467 28.8563 19.6274C28.8069 19.5081 28.7345 19.3997 28.6433 19.3085C28.552 19.2172 28.4437 19.1448 28.3244 19.0953C28.2052 19.0459 28.0773 19.0205 27.9483 19.0205Z" fill="white"/>
                      <path d="M4.00296 19.0205C3.80851 19.0204 3.61841 19.078 3.4567 19.186C3.29499 19.294 3.16893 19.4475 3.09447 19.6271C3.02001 19.8067 3.00049 20.0044 3.03838 20.1951C3.07626 20.3858 3.16986 20.561 3.30733 20.6985C3.4448 20.8361 3.61996 20.9297 3.81066 20.9677C4.00137 21.0057 4.19904 20.9862 4.3787 20.9118C4.55835 20.8374 4.7119 20.7114 4.81994 20.5498C4.92797 20.3881 4.98564 20.198 4.98564 20.0036C4.98583 19.8744 4.96055 19.7466 4.91124 19.6272C4.86193 19.5079 4.78956 19.3995 4.69828 19.3081C4.60699 19.2168 4.49859 19.1444 4.37927 19.095C4.25996 19.0457 4.13208 19.0204 4.00296 19.0205Z" fill="white"/>
                      <path d="M17.5007 18.4871C16.0069 18.1185 15.0533 17.7994 14.6399 17.5298C14.4495 17.4187 14.2919 17.2591 14.1833 17.0673C14.0746 16.8755 14.0187 16.6583 14.0214 16.4378C14.0144 16.2271 14.0565 16.0177 14.1444 15.8261C14.2323 15.6344 14.3634 15.4658 14.5276 15.3335C14.9265 15.0379 15.4163 14.8911 15.9121 14.9187C17.3678 14.9187 18.7788 15.4369 20.145 16.4733L22.1335 16.0472L21.9257 13.9091C21.1147 13.2299 20.1831 12.7093 19.1795 12.3747C18.1658 12.0214 17.1005 11.8389 16.027 11.8345C14.4198 11.8345 13.0805 12.2396 12.009 13.0499C10.9375 13.8603 10.4003 15.0124 10.3973 16.5065C10.3973 17.9988 10.8219 19.0946 11.671 19.794C12.5201 20.4934 13.8596 21.0605 15.6894 21.4952C16.8459 21.781 17.6195 22.0623 18.0103 22.3391C18.1948 22.4623 18.345 22.6302 18.4471 22.8272C18.5492 23.0241 18.5998 23.2437 18.5941 23.4654C18.6015 23.6838 18.5551 23.9006 18.4591 24.0969C18.3631 24.2931 18.2204 24.4628 18.0435 24.591C17.5956 24.8918 17.0618 25.038 16.5232 25.0074C15.0831 25.0074 13.5162 24.2664 11.8225 22.7846L11.8336 24.9249L9.74219 25.3625C11.7332 27.1968 13.9716 28.114 16.4575 28.114C18.1826 28.114 19.5754 27.6748 20.636 26.7966C21.1476 26.3859 21.5571 25.8623 21.8325 25.2668C22.1078 24.6713 22.2415 24.0202 22.223 23.3643C22.223 21.9524 21.81 20.8789 20.984 20.144C20.1581 19.409 18.9969 18.8567 17.5007 18.4871Z" fill="white"/>
                      {/* Diamond outline, red, visible in both modes */}
                      <path d="M30.9833 17.5331L18.4688 5.0179C17.813 4.36594 16.9259 4 16.0011 4C15.0764 4 14.1892 4.36594 13.5334 5.0179L1.0179 17.5331C0.365943 18.1889 0 19.076 0 20.0008C0 20.9255 0.365943 21.8127 1.0179 22.4685L13.5323 34.9814C14.1879 35.6337 15.0752 35.9999 16 35.9999C16.9249 35.9999 17.8121 35.6337 18.4677 34.9814L30.981 22.4685C31.6332 21.8129 31.9995 20.9259 31.9999 20.0012C32.0003 19.0765 31.6348 18.1892 30.9833 17.5331ZM11.8233 22.7826C13.5165 24.264 15.0834 25.0049 16.524 25.0054C17.0625 25.0359 17.5962 24.8897 18.0439 24.589C18.2208 24.4608 18.3635 24.2911 18.4596 24.0949C18.5557 23.8986 18.6021 23.6818 18.5949 23.4635C18.6005 23.2417 18.5499 23.0221 18.4477 22.8251C18.3456 22.6282 18.1952 22.4603 18.0107 22.3371C17.6195 22.0608 16.8458 21.7795 15.6898 21.4933C13.8578 21.058 12.5184 20.4909 11.6718 19.792C10.8252 19.0931 10.4005 17.9973 10.3977 16.5045C10.3977 15.0122 10.935 13.86 12.0094 13.048C13.0839 12.2359 14.4233 11.8307 16.0278 11.8325C17.1018 11.8365 18.1677 12.0191 19.1818 12.3727C20.1856 12.7066 21.1177 13.2262 21.9295 13.9045L22.1339 16.0449L20.1454 16.4709C18.7822 15.4345 17.3716 14.9163 15.9137 14.9163C15.4179 14.8885 14.928 15.0353 14.5292 15.3312C14.365 15.4635 14.2339 15.6321 14.1461 15.8237C14.0583 16.0154 14.0163 16.2248 14.0233 16.4355C14.0205 16.656 14.0763 16.8733 14.185 17.0652C14.2937 17.2571 14.4513 17.4168 14.6418 17.5278C15.0545 17.7977 16.008 18.1168 17.5026 18.4851C18.9971 18.8535 20.1568 19.4049 20.9815 20.1394C21.8072 20.8756 22.2202 21.949 22.2205 23.3597C22.239 24.0156 22.1053 24.6668 21.8299 25.2623C21.5544 25.8578 21.1448 26.3814 20.6331 26.792C19.5738 27.6712 18.181 28.1104 16.4546 28.1094C13.9692 28.1094 11.7307 27.1922 9.73927 25.3579L11.8371 24.9203L11.8233 22.7826Z" fill="#ED264F"/>
                      {/* Wordmark, white in dark mode, near-black in light */}
                      <path d="M41.1978 9.9937C38.0163 9.9937 35.6697 12.0504 35.6697 14.8466C35.6697 16.9265 36.4594 17.9202 39.1445 19.3067C40.566 20.0231 40.9045 20.3929 40.9045 21.063C40.9045 22.0105 40.0922 22.6345 38.8963 22.6345C37.8584 22.6345 37.0687 22.3109 35.7148 21.3634L34 24.3214C36.0082 25.5924 37.2717 26.0084 39.0768 26.0084C42.4388 26.0084 44.8306 23.8361 44.8306 20.7395C44.8306 18.7059 43.9731 17.6197 41.4911 16.4181C39.9568 15.6786 39.5732 15.3088 39.5732 14.5693C39.5732 13.7374 40.2276 13.229 41.2655 13.229C42.0778 13.229 42.8901 13.5756 43.9055 14.3613L45.5752 11.4034C44.1085 10.4328 42.7321 9.9937 41.1978 9.9937Z" fill={T.w}/>
                      <path d="M46.774 15.3782L44.9012 31H48.6017L49.4591 23.9517C50.4519 25.3845 51.5575 26.0084 53.0918 26.0084C55.98 26.0084 57.8979 23.6513 57.8979 20.0693C57.8979 16.9958 56.2959 15.0777 53.7462 15.0777C52.4375 15.0777 51.5124 15.4937 50.2037 16.6954L50.497 15.3782H46.774ZM51.738 23.0273C50.5196 23.0273 49.7298 22.1723 49.7298 20.855C49.7298 19.2836 50.7452 18.0819 52.1216 18.0819C53.34 18.0819 54.1072 18.9139 54.1072 20.2311C54.1072 21.8487 53.1144 23.0273 51.738 23.0273Z" fill={T.w}/>
                      <path d="M59.8869 15.3782L58.6459 25.708H62.3689L63.6099 15.3782H59.8869ZM60.0674 11.0798C60.0674 12.2353 60.97 13.1597 62.0982 13.1597C63.2263 13.1597 64.1289 12.2353 64.1289 11.0798C64.1289 9.92437 63.2263 9 62.0982 9C60.97 9 60.0674 9.92437 60.0674 11.0798Z" fill={T.w}/>
                      <path d="M65.2868 15.3782L64.0458 25.708H67.7688L68.3329 21.0399C68.5811 18.9832 69.1001 18.2437 70.296 18.2437C71.1534 18.2437 71.6498 18.8214 71.6498 19.8845C71.6498 20.2542 71.6272 20.5546 71.5595 21.1555L70.9954 25.708H74.7184L75.4179 19.9076C75.5082 19.1912 75.5307 18.6597 75.5307 18.2206C75.5307 16.187 74.4026 15.0777 72.3493 15.0777C70.9729 15.0777 70.0703 15.4706 68.6939 16.7185L69.0098 15.3782H65.2868Z" fill={T.w}/>
                      <path d="M77.4943 15.3782L76.2533 25.708H79.9763L80.5404 21.0399C80.7886 18.9832 81.3075 18.2437 82.5034 18.2437C83.3608 18.2437 83.8572 18.8214 83.8572 19.8845C83.8572 20.2542 83.8347 20.5546 83.767 21.1555L83.2029 25.708H86.9259L87.6254 19.9076C87.7156 19.1912 87.7382 18.6597 87.7382 18.2206C87.7382 16.187 86.61 15.0777 84.5567 15.0777C83.1803 15.0777 82.2778 15.4706 80.9014 16.7185L81.2173 15.3782H77.4943Z" fill={T.w}/>
                      <path d="M97.758 15.3782L95.8176 18.6366C95.2535 19.5609 94.8247 20.3697 94.4863 21.1324C94.2381 19.8613 94.0576 19.2143 93.6514 18.1744L92.5684 15.3782H88.4392L92.0043 24.8992L88.3941 31H92.5684L102 15.3782H97.758Z" fill={T.w}/>
                    </svg>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.mut, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 6 }}>Indian Market</div>
                  </td>
                  <td data-label="Post-booking" style={{ padding: "16px 18px", border: "1px solid rgba(91,123,255,0.2)", color: T.dim, verticalAlign: "top", lineHeight: 1.65, fontSize: 13 }}>
                    The homepage tends to have a Phoenix Experience which enables a user with scarce and surface level information. This enables in low confidence and reduces the decision velocity.
                  </td>
                  <td data-label="State awareness" style={{ padding: "16px 18px", border: "1px solid rgba(91,123,255,0.2)", verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: tbl.chipBg, color: T.mut, border: `1px solid ${tbl.chipBorder}` }}>None</span>
                      <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: tbl.chipBg, color: T.mut, border: `1px solid ${tbl.chipBorder}` }}>Committed users are invisible</span>
                    </div>
                  </td>
                  <td data-label="Verdict" style={{ padding: "16px 18px", border: "1px solid rgba(91,123,255,0.2)", verticalAlign: "top" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(91,123,255,0.15)", color: "#8fa8ff", border: "1px solid rgba(91,123,255,0.35)" }}>Gap</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <p style={{ marginTop: 6, marginBottom: 18, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
              Competitive audit across four Indian used-car platforms, none surface post-booking state on the homepage.
            </p>

            <B>
              No platform in the Indian used-car market surfaces booking state on the homepage for returning committed users.
              The gap isn&apos;t unique to Spinny, but that makes it an opportunity, not an excuse.
            </B>
          </Reveal>

        </Sec>

        {/* ── 05 DESIGN QUESTION ────────────────────────────────────────── */}
        <Sec id="reframe" cursorLabel="homepage as co-pilot">
          <Reveal>
            <Sn n="05." />
            <Sh text="How might we guide committed buyers?" />
            <Div />
            <B>
              Reframing the hypothesis from a system description to a user experience changed how the team thought about the solution space.
            </B>

            {/* What if block */}
            <div style={{ margin: "36px 0", padding: "32px 40px", background: T.card, borderLeft: `3px solid ${T.acc}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 14 }}>
                The design question
              </div>
              <div style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 600, lineHeight: 1.45, color: T.w, marginBottom: 16 }}>
                What if the Spinny homepage knew exactly where a buyer left off and showed them the fastest way to finish?
              </div>
              <div style={{ fontSize: 14, color: T.dim, lineHeight: 1.7, borderTop: `1px solid ${T.rule}`, paddingTop: 14 }}>
                The shift: from designing a page that presents inventory, to designing a page that responds to where the user is in their journey. Same homepage. Different mode. One clear next action.
              </div>
            </div>
          </Reveal>
        </Sec>

        {/* ── 06 CONSTRAINTS ────────────────────────────────────────────── */}
        <Sec id="constraints">
          <Reveal>
            <Sn n="06." />
            <Sh text="Working within the real world" />
            <Div />
            <B>
              Four constraints shaped what was possible before any exploration began.
              Understanding them early meant the solution didn&apos;t get killed in engineering review.
            </B>
          </Reveal>

          <Reveal delay={0.05}>
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {[
                { title: "ReactJS performance limits", body: "Complex patterns like snappable carousels were off the table. Clarity had to come from content hierarchy, not animation." },
                { title: "Platform team ownership", body: "The transaction dashboard under Profile was owned by a separate team. We could extend the homepage, not reorganise the architecture." },
                { title: "Leadership risk appetite", body: "Concern about conversion dips from major changes. The redesign had to be purely additive, no disruption to exploratory users." },
                { title: "4-week delivery window", body: "No extended discovery phase. Decisions grounded in existing behavioural data and rapid validation sprints." },
              ].map((c) => (
                <div key={c.title} style={{ padding: "18px 20px", background: T.card, borderLeft: `2px solid ${T.rule}` }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.w, marginBottom: 5 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{c.body}</div>
                </div>
              ))}
            </div>
          </Reveal>

        </Sec>

        {/* ── 07 IDEATION ───────────────────────────────────────────────── */}
        <Sec id="ideation" cursorLabel="two paths, one answer">
          <Reveal>
            <Sn n="07." />
            <Sh text="Two paths. One right answer" />
            <Div />
            <B>
              I explored two structurally distinct approaches. The goal wasn&apos;t the most ambitious solution, it was the one that solved the problem without creating new ones.
            </B>
          </Reveal>

          <Reveal delay={0.05}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "32px 0" }}>
              <div>
                <img
                  src={isDark ? "/images/buy-homepage/ideation-option1.png" : "/images/buy-homepage/ideation-option1-light.png"}
                  alt="Option 1, Inline Banner approach"
                  style={{ width: "100%", borderRadius: 12, display: "block" }}
                />
                <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                  Option A, Inline banner: a contextual strip above inventory. Lower disruption, limited information density.
                </p>
              </div>
              <div>
                <img
                  src={isDark ? "/images/buy-homepage/ideation-option2.png" : "/images/buy-homepage/ideation-option2-light.png"}
                  alt="Option 2, State-Aware Homepage (selected)"
                  style={{ width: "100%", borderRadius: 12, display: "block" }}
                />
                <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                  Option B, State-aware homepage mode: the page reconfigures based on transaction stage. <span style={{ color: T.w, fontWeight: 500 }}>Chosen direction.</span>
                </p>
              </div>
            </div>
            <B>
              We also explored a dedicated transaction dashboard and a snappable swipe interaction, both deprioritised due to ownership conflicts and performance constraints.
              The right answer was clarity, not novelty.
            </B>
          </Reveal>

        </Sec>

        {/* ── 08 FINAL DESIGNS ──────────────────────────────────────────── */}
        <Sec id="final" cursorLabel="state knows you">
          <Reveal>
            <Sn n="08." />
            <Sh text="Final Designs" />
            <Div />
            <Bl>
              The homepage dynamically adapts based on the user&apos;s transaction stage. Exploratory users see the existing browsing experience unchanged.
              Committed users see their stage and the one action they need to take, surfaced automatically.
            </Bl>
          </Reveal>

          <Reveal delay={0.05}>
            {/* 1, Bento grid */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                Design system
                <div style={{ flex: 1, height: 1, background: T.rule }} />
              </div>
              <img
                src={isDark ? "/images/buy-homepage/final-bento.png" : "/images/buy-homepage/final-bento-light.png"}
                alt="Bento grid, state-aware homepage components"
                style={{ width: "100%", borderRadius: 12, display: "block" }}
              />
              <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                Component library for the state-aware homepage, covers all transaction stages from test drive scheduling through delivery.
              </p>
            </div>

            {/* 2, Before & After side by side */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                Before &amp; After
                <div style={{ flex: 1, height: 1, background: T.rule }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <img
                    src={isDark ? "/images/buy-homepage/final-before.png" : "/images/buy-homepage/final-before-light.png"}
                    alt="Before, generic homepage, no booking acknowledgement"
                    style={{ width: "100%", borderRadius: 12, display: "block" }}
                  />
                  <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                    Before, a returning buyer sees the same browsing homepage as a first-time visitor. No booking acknowledgement, no next step.
                  </p>
                </div>
                <div>
                  <img
                    src={isDark ? "/images/buy-homepage/final-after.png" : "/images/buy-homepage/final-after-light.png"}
                    alt="After, state-aware homepage showing test drive details"
                    style={{ width: "100%", borderRadius: 12, display: "block" }}
                  />
                  <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                    After, the homepage surfaces the user&apos;s exact stage, relationship manager details, and one clear next action.
                  </p>
                </div>
              </div>
            </div>

            {/* 3, All transaction states + Tab carousel */}
            <StatesSection />
          </Reveal>
        </Sec>

        {/* ── 09 OUTCOME ────────────────────────────────────────────────── */}
        <Sec id="outcome" cursorLabel="numbers don't lie">
          <Reveal>
            <Sn n="09." />
            <Sh text="Outcome" />
            <Div />
            <B>
              By transforming the homepage into a journey-aware experience, active buyers got what they needed, visibility, context, a clear next step.
              At 2.5M MAU, small percentage improvements compound significantly.
            </B>
          </Reveal>

          <Reveal delay={0.05}>
            {/* Metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: T.rule, margin: "32px 0" }}>
              {[
                {
                  number: "−5.14%",
                  label: "Time-to-Visit (T2V)",
                  context: "Buyers moved faster from booking to showroom, less time in uncertainty, arriving more prepared.",
                },
                {
                  number: "+3.6%",
                  label: "User-to-Visit (U2V)",
                  context: "More users who booked actually showed up, the homepage reinforced commitment instead of ignoring it.",
                },
                {
                  number: "+3.2%",
                  label: "User-to-Delivery (U2D)",
                  context: "Users completed purchases with higher confidence, journey visibility reduced second-thoughts before delivery.",
                },
              ].map((m) => (
                <div key={m.label} style={{ background: T.card, padding: "28px 24px" }}>
                  <div style={{ fontSize: 44, fontWeight: 700, color: T.w, lineHeight: 1, marginBottom: 12, letterSpacing: -1 }}>
                    {m.number}
                  </div>
                  <hr style={{ border: "none", borderTop: `1px solid ${T.rule}`, marginBottom: 14 }} />
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 10 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>
                    {m.context}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ fontSize: 12, color: T.mut }}>Post-launch · A/B validated · Spinny 2025</span>
              <span style={{ fontSize: 12, color: T.mut }}>2.5M MAU</span>
            </div>

            <B style={{ marginTop: 24 }}>
              Uplift deepened further in the funnel, a signal this wasn&apos;t surface engagement, but a genuine improvement in decision quality among active buyers.
              All three downstream metrics moved together.
            </B>
          </Reveal>
        </Sec>

        {/* ── 10 REFLECTION ─────────────────────────────────────────────── */}
        <Sec id="reflection" cursorLabel="what the data taught">
          <Reveal>
            <Sn n="10." />
            <Sh text="What this taught me" />
            <Div />
            <B>
              The most important reframe happened before any design work. We weren&apos;t solving a UI problem, we were solving a continuity problem.
              The homepage didn&apos;t need to look different. It needed to know more.
            </B>
            <B>
              Working within real constraints, team ownership boundaries, performance limits, leadership risk thresholds, sharpened the solution rather than diluting it.
              The best answer wasn&apos;t the most ambitious. It was the one that worked within the system while quietly changing what it could do.
            </B>

            <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 28, marginTop: 32, fontSize: "clamp(18px,2.3vw,24px)", fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.45, color: T.w }}>
              Transactional users don&apos;t need more features.<br />
              They need the product to remember them.
            </div>
          </Reveal>
        </Sec>

        {/* ── READ NEXT ─────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 0 120px" }}>
          <Reveal>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 32 }}>
              Read next
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {[
                {
                  href: "/work/car-comparison",
                  cover: "/images/car-comparison/thumbnail.jpg",
                  year: "2024 · Spinny",
                  title: "Comparison feature adding decision speed",
                  tagline: "16% of users were already comparing cars. I built the layer that matched how they actually decided.",
                },
                {
                  href: "https://www.figma.com/proto/AaHU2t1WEMeJGvbdhi2kk7/Payments-page-Revamp?node-id=1826-1845&t=BU9KR1vWg6DsIfmq-1&scaling=scale-down-width&content-scaling=fixed&page-id=1517%3A56651&starting-point-node-id=1826%3A1845",
                  cover: "/images/checkout-cover.jpg",
                  year: "2024 · Cleartrip",
                  title: "Reducing drop-offs at Payment Funnel",
                  tagline: "~1,600 users were abandoning at trip summary. Opaque pricing was killing intent at the highest-stakes moment.",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ display: "block", borderRadius: 20, overflow: "hidden", background: T.card, textDecoration: "none", border: `1px solid ${T.rule}`, transition: "transform 0.25s, box-shadow 0.25s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 24px 60px -20px rgba(0,0,0,0.4)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}
                >
                  <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
                    <Image src={item.cover} alt={item.title} fill style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw, 50vw" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
                  </div>
                  <div style={{ padding: "20px 24px 24px" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.mut, marginBottom: 8 }}>{item.year}</p>
                    <p style={{ fontSize: 17, fontWeight: 600, color: T.w, marginBottom: 8, lineHeight: 1.3, letterSpacing: -0.3 }}>{item.title}</p>
                    <p style={{ fontSize: 14, color: T.mut, lineHeight: 1.6 }}>{item.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>

      </div>
    </article>
    </ThemeCtx.Provider>
  );
}
