"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type AgentState = "idle" | "listening" | "thinking" | "speaking" | "error";
type Message = { role: "user" | "bot"; text: string };

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  abort(): void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

const CHIPS = [
  "What's his strongest project?",
  "How do I get in touch?",
  "Is he open to new roles?",
  "What's his design process?",
];

const INTRO =
  "Hey — I'm Utkarsh's AI. Ask me anything a recruiter would want to know.";

// ── Strip markdown + any echoed JSON key names from bot output ───────────────
function cleanBotText(raw: string): string {
  return raw
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^(answer|text|response):\s*/i, "")
    .replace(/^["'`]|["'`]$/g, "")
    .replace(/\\n/g, " ")
    .trim();
}

// ── 3D Blob config per state — all aurora palette ────────────────────────────
// Gradient: light specular at top-left → aurora mid → deep at bottom-right (3D depth)
const BLOB = {
  idle: {
    gradient: "radial-gradient(circle at 34% 30%, #F5B9EA 0%, #C686FF 28%, #8D9FFF 55%, #AA6EEE 78%, #2a1560 100%)",
    shapes: [
      "62% 38% 46% 54% / 60% 44% 56% 40%",
      "52% 48% 52% 48% / 48% 52% 48% 52%",
      "62% 38% 46% 54% / 60% 44% 56% 40%",
    ],
    scale: [1, 1.02, 1] as number[],
    duration: 5.5,
    glow: "0 0 32px rgba(198,134,255,0.22), 0 0 64px rgba(141,159,255,0.1)",
    ripple: false,
  },
  listening: {
    gradient: "radial-gradient(circle at 30% 28%, #F5B9EA 0%, #C686FF 22%, #BC82F3 46%, #8D9FFF 68%, #251a70 100%)",
    shapes: [
      "68% 32% 48% 52% / 32% 52% 48% 68%",
      "32% 68% 32% 68% / 62% 32% 68% 38%",
      "54% 46% 68% 32% / 46% 62% 38% 54%",
      "68% 32% 48% 52% / 32% 52% 48% 68%",
    ],
    scale: [1, 1.09, 0.95, 1.07, 0.98, 1] as number[],
    duration: 1.5,
    glow: "0 0 44px rgba(198,134,255,0.45), 0 0 80px rgba(141,159,255,0.2)",
    ripple: false,
  },
  thinking: {
    gradient: "radial-gradient(circle at 38% 30%, #FFBA71 0%, #F5B9EA 28%, #C686FF 54%, #8D9FFF 76%, #1e1450 100%)",
    shapes: [
      "50% 50% 50% 50% / 50% 50% 50% 50%",
      "57% 43% 57% 43% / 43% 57% 43% 57%",
      "50% 50% 50% 50% / 50% 50% 50% 50%",
    ],
    scale: [1, 1.04, 0.98, 1.03, 1] as number[],
    duration: 2.2,
    glow: "0 0 38px rgba(245,185,234,0.35), 0 0 70px rgba(198,134,255,0.18)",
    ripple: false,
  },
  speaking: {
    gradient: "radial-gradient(circle at 30% 26%, #FFBA71 0%, #FF6778 18%, #F5B9EA 36%, #C686FF 56%, #8D9FFF 76%, #1a0e58 100%)",
    shapes: [
      "44% 56% 62% 38% / 56% 34% 66% 44%",
      "66% 34% 40% 60% / 40% 60% 34% 66%",
      "54% 46% 30% 70% / 30% 60% 70% 40%",
      "44% 56% 62% 38% / 56% 34% 66% 44%",
    ],
    scale: [1, 1.08, 0.94, 1.06, 0.97, 1] as number[],
    duration: 1.2,
    glow: "0 0 48px rgba(198,134,255,0.55), 0 0 96px rgba(141,159,255,0.28)",
    ripple: true,
  },
  error: {
    gradient: "radial-gradient(circle at 38% 32%, #F5B9EA 0%, #FF6778 30%, #C686FF 60%, #AA6EEE 82%, #3a0e20 100%)",
    shapes: [
      "50% 50% 50% 50% / 50% 50% 50% 50%",
      "54% 46% 54% 46% / 46% 54% 46% 54%",
      "50% 50% 50% 50% / 50% 50% 50% 50%",
    ],
    scale: [1, 1.02, 1] as number[],
    duration: 3.5,
    glow: "0 0 30px rgba(255,103,120,0.3), 0 0 60px rgba(198,134,255,0.15)",
    ripple: false,
  },
};

const MONO = '"IBM Plex Mono", "Courier New", monospace';
const GREEN = "#3bff6e";
const GREEN_DIM = "rgba(59,255,110,0.6)";
const GREEN_FAINT = "rgba(59,255,110,0.28)";

export function VoiceAgent() {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<AgentState>("idle");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [interimText, setInterimText] = useState("");
  const [inputText, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [introPlayed, setIntroPlayed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fabState, setFabState] = useState<"idle" | "ping" | "expanded" | "dismissed">("idle");
  const prefersReducedMotion = useReducedMotion();

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Detect mobile on mount and resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Shift page content when panel opens — desktop only, capped at 440px + 48px gap
  useEffect(() => {
    if (isMobile) {
      document.body.style.paddingRight = "0px";
      document.documentElement.classList.remove("voice-active");
      return;
    }
    document.body.style.transition = "padding-right 0.28s cubic-bezier(0.16,1,0.3,1)";
    if (open) {
      const panelWidth = Math.min(window.innerWidth * 0.25, 440);
      document.body.style.paddingRight = `${panelWidth}px`;
      document.documentElement.classList.add("voice-active");
    } else {
      document.body.style.paddingRight = "0px";
      document.documentElement.classList.remove("voice-active");
    }
    return () => {
      document.body.style.paddingRight = "0px";
      document.documentElement.classList.remove("voice-active");
    };
  }, [open, isMobile]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, state]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      audioRef.current?.pause();
      abortRef.current?.abort();
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
    };
  }, []);

  // FAB discovery sequence — ping → expand → dismiss
  useEffect(() => {
    const pingTimer    = setTimeout(() => setFabState("ping"),      1200);
    const expandTimer  = setTimeout(() => setFabState("expanded"),  3500);
    const dismissTimer = setTimeout(() => setFabState("dismissed"), 10000);
    return () => {
      clearTimeout(pingTimer);
      clearTimeout(expandTimer);
      clearTimeout(dismissTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll + highlight section ──────────────────────────────────────────────
  const scrollToSection = useCallback((section: string | null) => {
    if (!section || section === "null" || section === "none") return;

    if (section === "about") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(section);
    if (!el) return;

    // Calculate scroll distance to estimate duration, then highlight after landing
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(rect.top);
    // Smooth scroll in browsers takes ~500ms base + ~1ms per 2px distance, capped at 900ms
    const scrollDuration = Math.min(900, 500 + distance * 0.5);

    window.scrollTo({
      top: window.scrollY + rect.top - 96, // 96px header offset
      behavior: "smooth",
    });

    setTimeout(() => {
      el.classList.remove("voice-highlight");
      void el.offsetHeight; // force reflow so animation re-triggers
      el.classList.add("voice-highlight");
      setTimeout(() => el.classList.remove("voice-highlight"), 2700);
    }, scrollDuration);
  }, []);

  const stopAll = useCallback(() => {
    recognitionRef.current?.abort();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    abortRef.current?.abort();
    window.speechSynthesis?.cancel();
    setInterimText("");
    setState("idle");
  }, []);

  const interrupt = useCallback(() => {
    recognitionRef.current?.abort();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    abortRef.current?.abort();
    window.speechSynthesis?.cancel();
    setInterimText("");
  }, []);

  // Browser TTS fallback — prefers Indian English male voices where available.
  // Priority: Rishi (Apple Indian EN male) → Google Indian English →
  //           Heera/Ravi (Windows Indian) → calm generic male → any voice.
  const browserSpeak = useCallback((text: string) => new Promise<void>((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) { resolve(); return; }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    // Slightly slower, lower pitch → calmer, more measured feel
    utter.rate = 0.88;
    utter.pitch = 0.95;
    utter.volume = 1;

    const pickVoice = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) return;
      // Ordered preference list — first match wins
      const pick =
        voices.find((v) => v.name === "Rishi") ||                              // Apple Indian EN male
        voices.find((v) => v.name.includes("Google हिन्दी")) ||              // Chrome Indian
        voices.find((v) => v.lang === "en-IN" && !v.name.includes("female") && !v.name.includes("Female")) ||
        voices.find((v) => v.name.includes("Ravi")) ||                         // Windows Indian male
        voices.find((v) => v.lang === "en-IN") ||                              // any Indian EN
        voices.find((v) => v.name.includes("Google UK English Male")) ||
        voices.find((v) => v.name.includes("Daniel")) ||                       // Apple British male
        voices.find((v) => v.name.includes("Google US English")) ||
        voices.find((v) => !v.name.toLowerCase().includes("female") && v.lang.startsWith("en"));
      if (pick) utter.voice = pick;
    };

    pickVoice();
    // Chrome loads voices async — retry once they're ready
    if (synth.getVoices().length === 0) {
      synth.addEventListener("voiceschanged", pickVoice, { once: true });
    }
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    synth.speak(utter);
  }), []);

  const speak = useCallback(async (text: string) => {
    setState("speaking");
    abortRef.current = new AbortController();
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: abortRef.current.signal,
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { URL.revokeObjectURL(url); setState("idle"); };
        audio.onerror = () => { URL.revokeObjectURL(url); setState("idle"); };
        await audio.play();
      } else {
        // ElevenLabs unavailable (quota/key issue) — fall back to browser TTS
        await browserSpeak(text);
        setState("idle");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      // Last-resort browser TTS on any unexpected error
      try { await browserSpeak(text); } catch { /* ignore */ }
      setState("idle");
    }
  }, [browserSpeak]);

  const ask = useCallback(
    async (question: string, withHistory: Message[]) => {
      setState("thinking");
      abortRef.current = new AbortController();
      const apiHistory = withHistory.slice(-6).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question, history: apiHistory }),
          signal: abortRef.current.signal,
        });
        if (!res.ok) throw new Error("Chat failed");
        const data = await res.json();
        const rawText: string = data.text ?? "I couldn't generate a response.";
        const text = cleanBotText(rawText);
        const section: string | null = data.section ?? null;
        const navigate: string | null = data.navigate ?? null;
        const anchor: string | null = data.anchor ?? null;
        setMessages((prev) => [...prev, { role: "bot", text }]);

        // Navigate to the relevant page, or scroll on the current page
        setTimeout(() => {
          if (navigate && navigate !== pathname) {
            // Push to the page; if there's an anchor, append as hash so the
            // browser auto-scrolls once the page renders
            router.push(anchor ? `${navigate}#${anchor}` : navigate);
          } else if (anchor) {
            // Already on the right page — just scroll to the section
            scrollToSection(anchor);
          } else if (section) {
            scrollToSection(section);
          }
        }, 350);

        await speak(text);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setErrorMsg("Something went wrong. Please try again.");
        setState("error");
      }
    },
    [speak, scrollToSection]
  );

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      interrupt();
      setInputText("");
      setErrorMsg("");
      const userMsg: Message = { role: "user", text: trimmed };
      const next = [...messagesRef.current, userMsg];
      setMessages(next);
      ask(trimmed, next);
    },
    [ask, interrupt]
  );

  const startListening = useCallback(() => {
    interrupt();
    const SR =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setErrorMsg("Voice input isn't supported here. Type your question below.");
      setState("error");
      return;
    }
    setState("listening");
    setInterimText("");
    setErrorMsg("");
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalTranscript = "";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.results.length - 1; i >= 0; i--) {
        if (e.results[i].isFinal) { finalTranscript = e.results[i][0].transcript; break; }
        else { interim = e.results[i][0].transcript; }
      }
      setInterimText(finalTranscript || interim);
    };
    recognition.onend = () => {
      setInterimText("");
      const captured = finalTranscript.trim();
      if (captured) {
        const userMsg: Message = { role: "user", text: captured };
        const next = [...messagesRef.current, userMsg];
        setMessages(next);
        ask(captured, next);
      } else {
        setState("idle");
      }
    };
    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setInterimText("");
      if (e.error === "no-speech") { setState("idle"); }
      else if (e.error === "not-allowed") {
        setErrorMsg("Mic access denied. Type your question instead.");
        setState("error");
      } else {
        setErrorMsg("Mic error. Type your question instead.");
        setState("error");
      }
    };
    try { recognition.start(); } catch {
      setErrorMsg("Could not start voice input. Type your question.");
      setState("error");
    }
  }, [ask, interrupt]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setMessages([]);
    setInputText("");
    setInterimText("");
    setErrorMsg("");
    setState("idle");
    if (!introPlayed) {
      setIntroPlayed(true);
      introTimerRef.current = setTimeout(() => speak(INTRO), 380);
    }
  }, [introPlayed, speak]);

  const handleClose = useCallback(() => {
    if (introTimerRef.current) clearTimeout(introTimerRef.current);
    stopAll();
    setOpen(false);
  }, [stopAll]);

  const blob = BLOB[state];
  const statusLabel = {
    idle: "ready",
    listening: "listening...",
    thinking: "thinking...",
    speaking: "speaking...",
    error: "error",
  }[state];

  // Desktop: fixed right strip. Mobile: bottom sheet.
  const panelStyle = isMobile
    ? {
        position: "fixed" as const,
        bottom: 0, left: 0, right: 0,
        height: "55dvh",
        width: "100vw",
        zIndex: 60, // above header (z-50) so no overlap
        background: "var(--bg-elevated)",
        borderTop: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column" as const,
      }
    : {
        position: "fixed" as const,
        top: 0, right: 0,
        height: "100dvh",
        width: "25vw",
        minWidth: "300px",
        maxWidth: "440px",
        zIndex: 60, // above header (z-50) so it cleanly covers the right edge
        background: "var(--bg-elevated)",
        display: "flex",
        flexDirection: "column" as const,
      };

  const panelInitial = isMobile ? { y: "100%" } : { x: "100%" };
  const panelAnimate = isMobile ? { y: 0 } : { x: 0 };
  const panelExit = isMobile ? { y: "100%" } : { x: "100%" };

  return (
    <>
      {/* ── Floating trigger ─────────────────────────────────────────────── */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50" style={{ width: 48, height: 48 }}>
          {/* Sonar ping rings — fire once at t=1.2s */}
          {fabState === "ping" && !prefersReducedMotion && (
            <>
              <span className="aurora-ping" style={{ animationDelay: "0s" }} aria-hidden />
              <span className="aurora-ping" style={{ animationDelay: "0.45s" }} aria-hidden />
            </>
          )}

          {/* Morphing aurora FAB */}
          <motion.button
            type="button"
            aria-label="Talk to Utkarsh AI"
            data-cursor-label="ask me anything"
            onClick={() => {
              setFabState("dismissed");
              handleOpen();
            }}
            className="aurora-mic-btn aurora-fab-glow absolute right-0 bottom-0 flex h-12 items-center justify-center rounded-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            animate={{ width: fabState === "expanded" ? 220 : 48 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={fabState !== "dismissed" ? { scale: 1.04 } : {}}
          >
            {/* Text — fades in when expanded */}
            <AnimatePresence>
              {fabState === "expanded" && (
                <motion.span
                  key="fab-text"
                  initial={{ opacity: 0, maxWidth: 0 }}
                  animate={{ opacity: 1, maxWidth: 160 }}
                  exit={{ opacity: 0, maxWidth: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.28, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="pl-4 pr-1 text-[13px] font-medium text-white whitespace-nowrap overflow-hidden"
                  style={{ display: "block" }}
                >
                  Ask me anything
                </motion.span>
              )}
            </AnimatePresence>

            {/* Mic icon — always visible */}
            <span className="flex h-12 w-12 shrink-0 items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
                <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                <line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </motion.button>
        </div>
      )}

      {/* ── Aurora corner glows — 4 radial blobs, one per corner ───────── */}
      {/* Rendered as inline JSX (not CSS class) so overflow:clip on body
          cannot clip them. z-index 5 = above page content, below header(50). */}
      <AnimatePresence>
        {open && !isMobile && (() => {
          const panelRight = "clamp(300px, 25vw, 440px)";
          const corners = [
            { key: "tl", top: 0,    left: 0,          right: undefined, bottom: undefined, color: "#C686FF" },
            { key: "tr", top: 0,    right: panelRight, left: undefined,  bottom: undefined, color: "#8D9FFF" },
            { key: "bl", bottom: 0, left: 0,           right: undefined, top: undefined,    color: "#F5B9EA" },
            { key: "br", bottom: 0, right: panelRight, left: undefined,  top: undefined,    color: "#AA6EEE" },
          ];
          return corners.map(({ key, color, ...pos }) => (
            <motion.div
              key={key}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                position: "fixed",
                ...pos,
                width: "clamp(220px, 26vw, 360px)",
                height: "clamp(200px, 28vh, 340px)",
                background: `radial-gradient(circle at ${key.includes("l") ? "left" : "right"} ${key.includes("t") ? "top" : "bottom"}, ${color}55 0%, ${color}22 38%, transparent 72%)`,
                filter: "blur(52px)",
                pointerEvents: "none",
                zIndex: 5,
              }}
            />
          ));
        })()}
      </AnimatePresence>

      {/* ── Aurora crisp rotating border line ───────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="aurora-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Immersive bot panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Utkarsh AI"
            style={panelStyle}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px 10px",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#C686FF",
                    flexShrink: 0,
                  }}
                  animate={
                    state !== "idle" && state !== "error"
                      ? { scale: [1, 1.8, 1], opacity: [1, 0.2, 1] }
                      : { scale: 1, opacity: 0.35 }
                  }
                  transition={{ duration: state === "listening" ? 0.5 : 1.2, repeat: Infinity }}
                />
                <span
                  className="aurora-text"
                  style={{
                    fontFamily: '"Inter", system-ui, sans-serif',
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {statusLabel}
                </span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  opacity: 0.7,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              >
                <span className="aurora-text" style={{ fontFamily: '"Inter", system-ui, sans-serif', fontSize: 11, letterSpacing: "0.08em" }}>
                  esc
                </span>
              </button>
            </div>

            {/* Blob */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "6px 0 14px",
                flexShrink: 0,
              }}
            >
              {/* Outer glow halo */}
              <div style={{ position: "relative", width: 90, height: 90 }}>
                {/* Ripple rings — only when speaking, staggered for calm pulse */}
                {blob.ripple && [0, 1, 2].map((i) => (
                  <motion.div
                    key={`ripple-${i}`}
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      boxShadow: `0 0 0 1.5px ${i === 0 ? "#C686FF" : i === 1 ? "#8D9FFF" : "#F5B9EA"}`,
                      pointerEvents: "none",
                    }}
                    animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
                    transition={{
                      duration: 3.0,
                      delay: i * 0.95,
                      repeat: Infinity,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                ))}

                {/* Main blob shape */}
                <motion.div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: blob.gradient,
                    boxShadow: blob.glow,
                  }}
                  animate={{ borderRadius: blob.shapes, scale: blob.scale }}
                  transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Specular highlight — top-left catch-light for 3D depth */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "14%", left: "18%",
                    width: "32%", height: "26%",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.18) 55%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
                {/* Subtle rim light — bottom-right edge for roundness */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    bottom: "12%", right: "10%",
                    width: "22%", height: "18%",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(198,134,255,0.35) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Transcript */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "0 20px 8px",
                minHeight: 0,
                scrollbarWidth: "none" as const,
                display: "flex",
                flexDirection: "column" as const,
              }}
            >
              {/* Starter chips — pushed to bottom, left-aligned, slow relay reveal */}
              {messages.length === 0 && state === "idle" && (
                <div style={{ marginTop: "auto", paddingTop: 12 }}>
                  <p
                    className="aurora-text"
                    style={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase" as const,
                      marginBottom: 10,
                      opacity: 0.55,
                    }}
                  >
                    ask me anything
                  </p>
                  <div style={{ display: "flex", flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 7 }}>
                    {CHIPS.map((chip, idx) => (
                      <motion.button
                        key={chip}
                        onClick={() => submit(chip)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 0.78, x: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{
                          background: "none",
                          border: "1px solid rgba(198,134,255,0.28)",
                          borderRadius: 999,
                          padding: "6px 14px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          whiteSpace: "nowrap" as const,
                        }}
                        whileHover={{ borderColor: "rgba(198,134,255,0.75)", opacity: 1 } as never}
                      >
                        <span className="aurora-text" style={{ fontFamily: '"Inter", system-ui, sans-serif', fontSize: 11, letterSpacing: "0.01em" }}>
                          {chip}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message history with opacity fade on older lines */}
              {messages.map((msg, i) => {
                const opacity = Math.max(0.15, 1 - (messages.length - 1 - i) * 0.22);
                const prefix = msg.role === "bot" ? ">" : ">>";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginBottom: 10 }}
                  >
                    <p style={{ fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                      <span className="aurora-text" style={{ fontFamily: MONO, fontSize: 10, opacity: 0.6, marginRight: 8 }}>{prefix}</span>
                      <span
                        className="aurora-text"
                        style={{ fontFamily: '"Inter", system-ui, sans-serif', letterSpacing: "0.01em" }}
                      >
                        {msg.text}
                      </span>
                    </p>
                  </motion.div>
                );
              })}

              {/* Live interim */}
              {state === "listening" && interimText && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.65, margin: 0, fontStyle: "italic", opacity: 0.5 }}>
                    <span className="aurora-text" style={{ fontFamily: MONO, fontSize: 10, opacity: 0.4, marginRight: 8 }}>{">>"}</span>
                    <span className="aurora-text" style={{ fontFamily: '"Inter", system-ui, sans-serif', letterSpacing: "0.01em" }}>
                      {interimText}
                    </span>
                  </p>
                </div>
              )}

              {/* Thinking dots */}
              {state === "thinking" && (
                <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 5, paddingLeft: 20 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      style={{
                        display: "inline-block",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: i === 0 ? "#C686FF" : i === 1 ? "#8D9FFF" : "#F5B9EA",
                      }}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {state === "error" && errorMsg && (
                <p
                  style={{
                    fontFamily: '"Inter", system-ui, sans-serif',
                    fontSize: 13,
                    color: "#ff6b6b",
                    lineHeight: 1.65,
                    letterSpacing: "0.01em",
                    margin: 0,
                  }}
                >
                  <span className="aurora-text" style={{ fontFamily: MONO, fontSize: 10, opacity: 0.6, marginRight: 8 }}>!</span>
                  {errorMsg}
                </p>
              )}

              <div ref={transcriptEndRef} />
            </div>

            {/* Input + mic */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px max(20px, env(safe-area-inset-bottom, 20px)) 20px",
                flexShrink: 0,
                borderTop: "1px solid rgba(198,134,255,0.2)",
              }}
            >
              <div className={`aurora-input-wrap${state === "thinking" ? " disabled" : ""}`}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submit(inputText); }}
                  placeholder={state === "listening" ? "listening..." : "type a question..."}
                  disabled={state === "thinking"}
                  style={{
                    display: "block",
                    width: "100%",
                    background: "var(--bg)",
                    border: "none",
                    borderRadius: 79,
                    padding: "8px 16px",
                    fontFamily: '"Inter", system-ui, sans-serif',
                    fontSize: 12,
                    color: "var(--text)",
                    outline: "none",
                    letterSpacing: "0.01em",
                  }}
                />
              </div>
              <motion.button
                type="button"
                onClick={state === "listening" ? stopAll : startListening}
                aria-label={state === "listening" ? "Stop listening" : "Start voice input"}
                animate={state === "listening" ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={state === "listening" ? { duration: 0.7, repeat: Infinity } : {}}
                className={state !== "listening" ? "aurora-mic-btn" : ""}
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: state === "listening" ? "rgba(239,68,68,0.18)" : undefined,
                  border: state === "listening" ? "1px solid rgba(239,68,68,0.5)" : undefined,
                  color: state === "listening" ? "#ff6b6b" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {/* Wave bars — animated when listening or speaking */}
                {(() => {
                  const isActive = state === "listening" || state === "speaking";
                  const BAR_HEIGHTS = [5, 9, 6, 11, 7];
                  const H = 14;
                  return (
                    <svg width="18" height={H} viewBox={`0 0 18 ${H}`} fill="currentColor" style={{ overflow: "visible" }}>
                      {BAR_HEIGHTS.map((h, i) => (
                        <motion.rect
                          key={i}
                          x={i * 4}
                          width={2.5}
                          rx={1.25}
                          animate={isActive ? {
                            height: [h, h * 1.9, h * 0.45, h * 1.6, h],
                            y: [(H - h) / 2, (H - h * 1.9) / 2, (H - h * 0.45) / 2, (H - h * 1.6) / 2, (H - h) / 2],
                          } : {
                            height: h * 0.55,
                            y: (H - h * 0.55) / 2,
                          }}
                          transition={{
                            duration: state === "listening" ? 0.45 : 0.9,
                            delay: i * 0.09,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </svg>
                  );
                })()}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
