"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { Reveal } from "@/components/Reveal";

// ─── Design tokens ────────────────────────────────────────────────────────────
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

// ─── Helper components ────────────────────────────────────────────────────────
function Sec({ children, id, cursorLabel }: { children: React.ReactNode; id?: string; cursorLabel?: string }) {
  const T = useContext(ThemeCtx);
  return (
    <section id={id} data-cursor-label={cursorLabel} style={{ borderBottom: `1px solid ${T.rule}`, padding: "96px 0 56px" }}>
      {children}
    </section>
  );
}

function Sn({ n }: { n: string }) {
  const T = useContext(ThemeCtx);
  return <p style={{ fontSize: 13, color: T.mut, marginBottom: 10, fontWeight: 400 }}>{n}</p>;
}

function Sh({ children, tag = "h2" }: { children: React.ReactNode; tag?: "h1" | "h2" }) {
  const T = useContext(ThemeCtx);
  const Tag = tag;
  return (
    <Tag style={{ fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.06, color: T.w }}>
      {children}
    </Tag>
  );
}

function Div() {
  const T = useContext(ThemeCtx);
  return <hr style={{ border: "none", borderTop: `1px solid ${T.rule}`, margin: "28px 0 40px" }} />;
}

function B({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const T = useContext(ThemeCtx);
  return <p style={{ fontSize: 15, color: T.dim, lineHeight: 1.85, marginBottom: 18, maxWidth: 820, ...style }}>{children}</p>;
}

function Bl({ children }: { children: React.ReactNode }) {
  const T = useContext(ThemeCtx);
  return <p style={{ fontSize: 17, fontWeight: 500, color: T.w, lineHeight: 1.75, marginBottom: 20, maxWidth: 820 }}>{children}</p>;
}

function SectionImage({ src, alt, caption, aspect = "16/9" }: { src: string; alt: string; caption?: string; aspect?: string }) {
  const T = useContext(ThemeCtx);
  return (
    <div style={{ margin: "40px 0" }}>
      <div style={{ borderRadius: 6, overflow: "hidden", background: T.card, position: "relative", width: "100%", aspectRatio: aspect }}>
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="(max-width:768px) 100vw, 1100px" />
      </div>
      {caption && <p style={{ marginTop: 10, fontSize: 13, color: T.mut, lineHeight: 1.6 }}>{caption}</p>}
    </div>
  );
}

// ─── Theme hook ───────────────────────────────────────────────────────────────
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

// ─── Funnel bar chart ─────────────────────────────────────────────────────────
const FUNNEL_DATA = [
  { stage: "Test Drive Scheduled", non: 2.04,  comp: 12.50, mult: "6.1×" },
  { stage: "Test Drive Completed", non: 0.77,  comp: 6.73,  mult: "8.7×" },
  { stage: "Token Paid",           non: 0.31,  comp: 3.56,  mult: "11.5×" },
  { stage: "Delivery",             non: 0.15,  comp: 1.74,  mult: "11.6×" },
];

const MAX_VAL = 12.50;

function FunnelChart() {
  const T = useContext(ThemeCtx);

  return (
    <div style={{ margin: "28px 0 8px" }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: T.mut, opacity: 0.5 }} />
          <span style={{ fontSize: 12, color: T.mut }}>Non-comparing</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: T.acc }} />
          <span style={{ fontSize: 12, color: T.mut }}>Comparing</span>
        </div>
      </div>

      {/* Horizontal bar rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {FUNNEL_DATA.map((d) => {
          const nonPct  = (d.non  / MAX_VAL) * 100;
          const compPct = (d.comp / MAX_VAL) * 100;

          return (
            <div key={d.stage}>
              {/* Row header: stage name + values */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.w }}>{d.stage}</span>
                <div style={{ display: "flex", gap: 20 }}>
                  <span style={{ fontSize: 12, color: T.mut }}>Non <strong style={{ color: T.w, fontWeight: 600 }}>{d.non}%</strong></span>
                  <span style={{ fontSize: 12, color: T.mut }}>Cmp <strong style={{ color: T.acc, fontWeight: 600 }}>{d.comp}%</strong></span>
                </div>
              </div>

              {/* Non-comparing bar */}
              <div style={{ height: 6, background: T.rule, borderRadius: 3, marginBottom: 3, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${nonPct}%`, background: T.mut, opacity: 0.45, borderRadius: 3 }} />
              </div>
              {/* Comparing bar */}
              <div style={{ height: 6, background: T.rule, borderRadius: 3, marginBottom: 7, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${compPct}%`, background: T.acc, borderRadius: 3 }} />
              </div>

              {/* Bottom row: axis label left, multiplier right, same horizontal line */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ height: 1, flex: 1, background: T.rule }} />
                <span style={{
                  marginLeft: 12, fontSize: 11, fontWeight: 700, color: T.grn,
                  letterSpacing: "0.02em", whiteSpace: "nowrap",
                }}>
                  {d.mult} higher
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CarComparisonPage() {
  const isDark = useIsDark();
  const T = isDark ? DARK : LIGHT;

  const tbl = {
    labelBg:    isDark ? "#111111" : "#ececea",
    compBg:     isDark ? "#1e0a12" : "#fff0f2",
    labelColor: isDark ? "#505050" : "#888888",
  };

  const meta = [
    { label: "Role",     value: "Lead Designer" },
    { label: "Team",     value: "1 PM · 3 Eng · 1 Analyst" },
    { label: "Platform", value: "iOS · Android · PWA" },
    { label: "Timeline", value: "6 Weeks · 2024" },
  ];

  return (
    <ThemeCtx.Provider value={T}>
      <article style={{
        background: T.bg, color: T.w,
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 16, lineHeight: 1.65,
        WebkitFontSmoothing: "antialiased",
        colorScheme: isDark ? "dark" : "light",
      }}>
        <ScrollProgressBar />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 60px" }}>

          {/* ── 01 HERO ──────────────────────────────────────────────────────── */}
          <Sec id="hero">
            <Reveal>
              <Sn n="01." />
              <Sh tag="h1">
                Designing a comparison feature<br />for decision speed
              </Sh>
              <Div />
              <Bl>
                Users comparing cars on Spinny were making a decision the product couldn&apos;t see.
                They bounced between listings, returned to the same cars repeatedly, managed their own tabs.
                The data had the signal. The product had nothing built for it.
              </Bl>

              {/* Metadata grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginTop: 44, borderTop: `1px solid ${T.rule}` }}>
                {meta.map((m, i) => (
                  <div key={m.label} style={{ padding: "20px 0 0", paddingLeft: i === 0 ? 0 : 20, borderLeft: i === 0 ? "none" : `1px solid ${T.rule}` }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.mut, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>{m.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.w }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </Reveal>

          </Sec>

          {/* ── 02 PROBLEM ───────────────────────────────────────────────────── */}
          <Sec id="problem" cursorLabel="the A to B pattern">
            <Reveal>
              <Sn n="02." />
              <Sh>Problem</Sh>
              <Div />
              <h3 style={{ fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 700, letterSpacing: -1, color: T.w, marginBottom: 28, lineHeight: 1.1 }}>
                The A→B→A pattern.<br />A user doing comparison work the product wouldn&apos;t help with.
              </h3>
              <B>
                Behavioural analysis across 238,000 users revealed a pattern: users would visit car A, switch to car B,
                return to car A, go back to car B. We called it A→B→A. It wasn&apos;t indecision , 
                it was a user actively trying to decide without the right tool.
              </B>

              {/* Pull quote */}
              <div style={{ margin: "28px 0", padding: "24px 32px", background: T.card, borderLeft: `3px solid ${T.acc}` }}>
                <p style={{ fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 500, lineHeight: 1.6, color: T.w, margin: 0 }}>
                  &ldquo;Users were already comparing. The product just wasn&apos;t helping them do it.&rdquo;
                </p>
              </div>

              <B>
                Drop-offs spiked at this exact point. The problem wasn&apos;t that users couldn&apos;t choose , 
                it was that the product was forcing them to hold two cars in memory simultaneously,
                across multiple sessions, without any support.
              </B>
            </Reveal>

            <Reveal delay={0.05}>
              {/* Browser vs Comparer table */}
              <table style={{ width: "100%", borderCollapse: "collapse", margin: "32px 0", fontSize: 14 }}>
                <thead>
                  <tr>
                    <th style={{ width: 140, padding: "16px 20px", background: tbl.labelBg, border: `1px solid ${T.rule}`, textAlign: "left" }} />
                    <th style={{ padding: "16px 20px", background: tbl.labelBg, border: `1px solid ${T.rule}`, textAlign: "left", fontSize: 15, fontWeight: 500, color: tbl.labelColor }}>
                      The Browser
                    </th>
                    <th style={{ padding: "16px 20px", background: tbl.compBg, borderTop: "1px solid rgba(200,60,80,0.25)", borderRight: "1px solid rgba(200,60,80,0.25)", borderBottom: "1px solid rgba(200,60,80,0.25)", borderLeft: "2px solid #c83c50", textAlign: "left" }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: T.w }}>The Comparer</span>
                      <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, background: isDark ? "rgba(249,150,165,0.18)" : "#c83c50", color: isDark ? "#f9a8b8" : "#ffffff", border: isDark ? "1px solid rgba(249,150,165,0.35)" : "none", padding: "2px 10px", borderRadius: 100, marginLeft: 10, verticalAlign: "middle" }}>
                        The Gap
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "BEHAVIOUR",     browser: "Scrolling listings. Saving favourites. Not ready to decide.",       comp: "Visiting the same 2–3 cars repeatedly. Bouncing between PDPs." },
                    { label: "GOAL",          browser: "Find cars worth considering",                                       comp: "Pick between cars already in their shortlist" },
                    { label: "PRODUCT OFFERS", browser: "Listings, filters, search, serves this user well",               comp: "The same listings again. No comparison tool." },
                    { label: "DROP-OFF RISK", browser: "Low, still discovering",                                           comp: "High, cognitive overload leads to abandonment" },
                  ].map((row, i) => (
                    <tr key={row.label} style={{ borderTop: i === 0 ? "none" : `1px solid ${T.rule}` }}>
                      <td style={{ fontSize: 10, fontWeight: 700, color: tbl.labelColor, letterSpacing: "0.08em", textTransform: "uppercase", background: tbl.labelBg, padding: "18px 20px", border: `1px solid ${T.rule}`, verticalAlign: "middle" }}>
                        {row.label}
                      </td>
                      <td style={{ padding: "18px 20px", border: `1px solid ${T.rule}`, color: T.dim, verticalAlign: "middle", lineHeight: 1.6, fontSize: 13 }}>
                        {row.browser}
                      </td>
                      <td style={{ padding: "18px 20px", background: tbl.compBg, borderTop: "1px solid rgba(200,60,80,0.18)", borderRight: "1px solid rgba(200,60,80,0.18)", borderBottom: "1px solid rgba(200,60,80,0.18)", borderLeft: "2px solid #c83c50", color: T.w, verticalAlign: "middle", lineHeight: 1.6, fontSize: 13 }}>
                        {row.comp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ marginTop: 6, marginBottom: 18, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                Two user types, one product, the comparer was entirely underserved.
              </p>
            </Reveal>
          </Sec>

          {/* ── 03 THE DATA ──────────────────────────────────────────────────── */}
          <Sec id="data" cursorLabel="capable users, let down">
            <Reveal>
              <Sn n="03." />
              <Sh>The data</Sh>
              <Div />
              <B>
                I analysed conversion across the 2.3M PDP user base to understand how comparison behaviour
                correlated with downstream purchase. The signal was unambiguous, and the gap between
                comparing and non-comparing users widened at every stage of the funnel.
              </B>

              {/* 3 stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: T.rule, margin: "36px 0" }}>
                {[
                  { n: "1 in 6", l: "PDP users ever compare", c: "318,287 comparing users out of 2.3M. Most users browse without ever comparing, the behaviour is undiscovered." },
                  { n: "11×",    l: "Higher delivery conversion", c: "Comparing users deliver at 1.74% vs 0.15% for non-comparing. Same funnel, same period, entirely different outcomes." },
                  { n: "59%",   l: "Engaged segment reach delivery", c: "Users who revisited 3+ cars deeply showed the highest purchase follow-through of any behavioural segment." },
                ].map(({ n, l, c }) => (
                  <div key={l} style={{ background: T.card, padding: "24px 20px" }}>
                    <div style={{ fontSize: 40, fontWeight: 700, color: T.w, lineHeight: 1, marginBottom: 8, letterSpacing: -1 }}>{n}</div>
                    <hr style={{ border: "none", borderTop: `1px solid ${T.rule}`, margin: "0 0 12px" }} />
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 8 }}>{l}</div>
                    <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.6 }}>{c}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              {/* Funnel bar chart */}
              <div style={{ background: isDark ? "#141414" : "#e8e8e6", borderRadius: 12, padding: "36px 32px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 4 }}>
                  Conversion at each funnel stage, comparing vs non-comparing
                </div>
                <FunnelChart />
              </div>
              <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                Conversion rates across 2.3M PDP users. Comparing users (n≈238K) vs non-comparing users. A/B validated post-launch.
              </p>

              <div style={{ marginTop: 32 }}>
                <B>
                  The gap widens at every stage. By delivery, comparing users convert at 11.6× the rate of
                  non-comparing users. Comparison isn&apos;t just a feature request, it&apos;s the strongest
                  behavioural predictor of purchase in the dataset.
                </B>
              </div>
            </Reveal>
          </Sec>

          {/* ── 04 DESIGN QUESTION ───────────────────────────────────────────── */}
          <Sec id="design-question" cursorLabel="support, don't interrupt">
            <Reveal>
              <Sn n="04." />
              <Sh>Design question</Sh>
              <Div />

              {/* HMW callout, matches Buy Homepage design question block */}
              <div style={{ margin: "36px 0", padding: "32px 40px", background: T.card, borderLeft: `3px solid ${T.acc}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 14 }}>
                  The design question
                </div>
                <div style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 600, lineHeight: 1.45, color: T.w, marginBottom: 16 }}>
                  How might we surface the next step for a comparing user, without interrupting the browsing they&apos;re already doing?
                </div>
                <div style={{ fontSize: 14, color: T.dim, lineHeight: 1.7, borderTop: `1px solid ${T.rule}`, paddingTop: 14 }}>
                  The shift: from showing inventory to supporting the decision already in progress. The trigger had to be behavioural, no explicit Compare CTA, no artificial adoption bias.
                </div>
              </div>

              <B>
                The HMW moved us from describing a problem to framing a product opportunity.
                The user wasn&apos;t broken, they were doing real decision-making work.
                We needed to give them a better tool for it. The key constraint: no explicit &lsquo;Compare&rsquo; CTA.
                Adding a visible button would introduce artificial adoption bias. The trigger had to be behavioural.
              </B>
            </Reveal>
          </Sec>

          {/* ── 05 CONSTRAINTS ───────────────────────────────────────────────── */}
          <Sec id="constraints">
            <Reveal>
              <Sn n="05." />
              <Sh>Working within<br />the real world</Sh>
              <Div />
              <B>Four constraints shaped what was possible before exploration began.</B>
            </Reveal>

            <Reveal delay={0.05}>
              <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { title: "Performance budget", body: "A significant portion of users were on mid-to-low Android devices. The comparison view had to load fast and avoid layout shifts, CLS was a hard constraint, not a nice-to-have." },
                  { title: "Team ownership", body: "The PDP was owned by a separate team. The comparison entry point had to work without touching PDP code, the tray had to be fully self-contained and contextually injected." },
                  { title: "Data normalisation gaps", body: "Not all car attributes were in consistent format across the inventory. The comparison view had to degrade gracefully, missing specs couldn't break the layout or the decision flow." },
                  { title: "Six-week delivery window", body: "Decisions had to be grounded in existing behavioural data. No time for new research cycles, every design choice had to be defensible from the data already in the system." },
                ].map((c) => (
                  <div key={c.title} style={{ padding: "18px 20px", background: T.card, borderLeft: `2px solid ${T.rule}` }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.w, marginBottom: 5 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{c.body}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </Sec>

          {/* ── 06 EXPLORATION ───────────────────────────────────────────────── */}
          <Sec id="exploration" cursorLabel="three structures, one winner">
            <Reveal>
              <Sn n="06." />
              <Sh>Two paths.<br />One right answer.</Sh>
              <Div />
              <B>
                I explored two structurally distinct approaches. The goal wasn&apos;t the most ambitious solution,
                it was the one that solved the problem without creating new ones. Both were prototyped and
                reviewed against the same brief: reduce cognitive load at the moment of decision.
              </B>
            </Reveal>

            <Reveal delay={0.05}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "32px 0" }}>
                <div>
                  <img
                    src={isDark ? "/images/car-comparison/two-paths-option1-dark.png" : "/images/car-comparison/two-paths-option1-light.png"}
                    alt="Option 1, Inline comparison strip"
                    style={{ width: "100%", borderRadius: 12, display: "block" }}
                  />
                  <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                    Option 1 reads as data, not decision. Two independent bars give accurate numbers but no relative signal — the user still has to do the mental subtraction. Under time pressure or on a mid-range device, that&apos;s exactly where comparison falls apart.
                  </p>
                </div>
                <div>
                  <img
                    src={isDark ? "/images/car-comparison/two-paths-option2-dark.png" : "/images/car-comparison/two-paths-option2-light.png"}
                    alt="Option 2, Dedicated comparison surface (live version)"
                    style={{ width: "100%", borderRadius: 12, display: "block" }}
                  />
                  <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                    Option 2 <span style={{ color: T.w, fontWeight: 500 }}>· shipped.</span> A single axis makes one car the implicit reference point. The delta reads instantly — no arithmetic, no toggling, no memory. The user&apos;s job shifts from &ldquo;calculate which is better&rdquo; to &ldquo;confirm what I already sense.&rdquo; That shift is the design.
                  </p>
                </div>
              </div>

              <B>
                The inline strip checked every functional box but failed on scalability and performance. The dedicated comparison surface, launched from a contextual tray that appears only after the user shows comparison intent, preserved browsing continuity and delivered a focused decision experience. Option 2 was selected for all use cases.
              </B>
            </Reveal>
          </Sec>

          {/* ── 07 FINAL DESIGNS ─────────────────────────────────────────────── */}
          <Sec id="final-designs" cursorLabel="tested before it shipped">
            <Reveal>
              <Sn n="07." />
              <Sh>Final Designs</Sh>
              <Div />
              <B>
                The comparison feature surfaces at the exact moment a user shows comparison intent — after visiting
                multiple PDPs. It doesn&apos;t interrupt browsing. It doesn&apos;t ask the user to change
                behaviour. It offers a better tool at the moment they need it, and disappears otherwise.
                Three screens. One job: close the decision.
              </B>
            </Reveal>

            <Reveal delay={0.05}>
              {/* 1, Bento Grid */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  Feature overview
                  <div style={{ flex: 1, height: 1, background: T.rule }} />
                </div>
                <img
                  src={isDark ? "/images/car-comparison/final-bento-dark.png" : "/images/car-comparison/final-bento-light.png"}
                  alt="Car comparison, bento grid overview"
                  style={{ width: "100%", borderRadius: 12, display: "block" }}
                />
                <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                  Three screens with a clear hierarchy of jobs: select, compare, decide. Notice that none of
                  these screens introduce unfamiliar UI patterns — the card language is the same as listings,
                  the navigation chrome doesn&apos;t change. The only new idea is the difference indicator.
                  Familiar enough to trust, specific enough to act on.
                </p>
              </div>

              {/* 2, Entry Points */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  Entry points
                  <div style={{ flex: 1, height: 1, background: T.rule }} />
                </div>
                <img
                  src={isDark ? "/images/car-comparison/final-entry-dark.png" : "/images/car-comparison/final-entry-light.png"}
                  alt="Comparison feature entry points"
                  style={{ width: "100%", borderRadius: 12, display: "block" }}
                />
                <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                  The tray doesn&apos;t announce itself. It surfaces when the behaviour says the user is ready —
                  only after the A→B→A pattern fires. There&apos;s no CTA to ignore, no modal to dismiss.
                  Timing is the design here. The same interaction, surfaced ten seconds earlier, would have
                  felt like an interruption. Here it feels like the product read your mind.
                </p>
              </div>

              {/* 3, Car Comparison feature detail */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  Spec comparison card
                  <div style={{ flex: 1, height: 1, background: T.rule }} />
                </div>
                <img
                  src={isDark ? "/images/car-comparison/final-feature-dark.png" : "/images/car-comparison/final-feature-light.png"}
                  alt="Spec comparison card with difference indicators"
                  style={{ width: "100%", borderRadius: 12, display: "block" }}
                />
                <p style={{ marginTop: 10, fontSize: 12, color: T.mut, lineHeight: 1.6 }}>
                  The hardest decision here wasn&apos;t the layout — it was what not to show. Grouping by
                  category (comfort, performance, safety) mirrors how buyers think, not how the database
                  stores data. The difference indicator removes the arithmetic entirely. The AI summary at
                  the top collapses the full table into one sentence for the user who&apos;s already decided
                  and just needs confirmation. Hierarchy doing the work that scrolling used to do.
                </p>
              </div>
            </Reveal>
          </Sec>

          {/* ── 08 OUTCOME ───────────────────────────────────────────────────── */}
          <Sec id="outcome" cursorLabel="funnel went deeper">
            <Reveal>
              <Sn n="08." />
              <Sh>Outcome</Sh>
              <Div />
              <B>
                By giving users a structured way to compare, we shortened the decision cycle and improved
                downstream conversion at every funnel stage. At 2.3M PDP users, the impact compounded significantly.
              </B>
            </Reveal>

            <Reveal delay={0.05}>
              {/* 3 primary metric cards, same pattern as Buy Homepage */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: T.rule, margin: "32px 0" }}>
                {[
                  { value: "+5.3%", label: "User-to-Delivery (U2D)", context: "The most downstream measure. Comparing users reaching delivery increased significantly post-launch, confirmed via randomised A/B test." },
                  { value: "+3.8%", label: "User-to-Test Drive (U2T)", context: "Earlier in the funnel but harder to move. The comparison view surfacing direct booking drove this metric up independently." },
                  { value: "↓ A→B→A", label: "Oscillation reduced", context: "Users stopped bouncing between PDPs. The comparison view gave them a structured place to do that work, measurably reducing session oscillation." },
                ].map((m) => (
                  <div key={m.label} style={{ background: T.card, padding: "28px 24px" }}>
                    <div style={{ fontSize: 44, fontWeight: 700, color: T.w, lineHeight: 1, marginBottom: 12, letterSpacing: -1 }}>
                      {m.value}
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

              {/* Speed metrics, 2-column, same grid treatment */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.rule }}>
                {[
                  { value: "−12.4%", label: "Time-to-Token", context: "Users moved from comparison to token payment faster after the feature launched." },
                  { value: "−18.3%", label: "Time-to-Visit", context: "Time from first PDP view to test drive visit dropped, fewer sessions needed to reach commitment." },
                ].map((m) => (
                  <div key={m.label} style={{ background: T.card, padding: "24px 24px" }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: T.w, lineHeight: 1, marginBottom: 10, letterSpacing: -0.5 }}>
                      {m.value}
                    </div>
                    <hr style={{ border: "none", borderTop: `1px solid ${T.rule}`, marginBottom: 12 }} />
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.mut, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{m.label}</div>
                    <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{m.context}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: 12, color: T.mut }}>Post-launch · A/B validated · Spinny 2024</span>
                <span style={{ fontSize: 12, color: T.mut }}>2.3M PDP users</span>
              </div>
            </Reveal>
          </Sec>

          {/* ── 09 REFLECTION ────────────────────────────────────────────────── */}
          <Sec id="reflection" cursorLabel="demand was already there">
            <Reveal>
              <Sn n="09." />
              <Sh>What this<br />taught me</Sh>
              <Div />
              <Bl>
                The most important discovery happened in the data before any design work.
                Users were already comparing. They were doing it manually, at significant cognitive cost.
                The product just wasn&apos;t acknowledging it.
              </Bl>
              <B>
                That reframe changed everything. We weren&apos;t building a new feature from scratch , 
                we were building the tool users were already trying to use. That&apos;s a fundamentally different brief.
                One where you already know the behaviour works. You just need to make it less effortful.
              </B>
              <B>
                Working with a clear behavioural signal, the A→B→A pattern, disciplined the design process.
                Every decision came back to one question: does this make comparison faster and less cognitively demanding?
                If not, it didn&apos;t ship.
              </B>

              <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 28, marginTop: 32, fontSize: "clamp(18px,2.3vw,24px)", fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.45, color: T.w }}>
                Users weren&apos;t confused about which car to buy.<br />
                They just needed the product to stop making it harder.
              </div>
            </Reveal>
          </Sec>

          {/* ── READ NEXT ─────────────────────────────────────────────────────── */}
          <section style={{ padding: "80px 0 120px" }}>
            <Reveal>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, marginBottom: 32 }}>
                Read next
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {[
                  {
                    href: "/work/spinny-buy-homepage",
                    cover: "/images/buy-homepage/thumbnail.jpg",
                    year: "2025 · Spinny",
                    title: "Redesigning Spinny's homepage for committed buyers",
                    tagline: "Returning buyers landed on the same homepage as first-time visitors. The system knew their state. The homepage didn't show it.",
                  },
                  {
                    href: "https://www.figma.com/proto/aTR4rObDbhSFkR7KoDOiOS/Portfolio-Website?node-id=62-83&t=EcDlaxQr0arGC1bo-1&scaling=scale-down-width&content-scaling=fixed&page-id=1%3A3&starting-point-node-id=62%3A83",
                    cover: "/images/analytics-cover.jpg",
                    year: "2023 · ET Prime",
                    title: "Improving ET Prime feature discoverability",
                    tagline: "Paid subscribers were under-using features they'd already paid for. A discoverability problem, not a product one.",
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
