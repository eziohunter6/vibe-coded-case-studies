"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AgentState = "idle" | "listening" | "thinking" | "speaking" | "error";
type Message = { role: "user" | "bot"; text: string };

// Minimal Web Speech API types (not in default TS lib)
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
  "How does he work with engineers?",
  "Is he open to new roles?",
  "What's his design process?",
];

const INTRO =
  "I'm Utkarsh's AI — vibe-coded on Claude Code. Ask me anything a recruiter would want to know.";

// ── 3D Blob config per state ──────────────────────────────────────────────────
const BLOB = {
  idle: {
    gradient: "radial-gradient(circle at 38% 32%, #3a3a3a 0%, #1a1a1a 55%, #0a0a0a 100%)",
    shapes: [
      "62% 38% 46% 54% / 60% 44% 56% 40%",
      "38% 62% 54% 46% / 44% 56% 44% 56%",
      "62% 38% 46% 54% / 60% 44% 56% 40%",
    ],
    scale: [1, 1.015, 1] as number[],
    duration: 5,
    glow: "0 0 40px rgba(80,80,80,0.15)",
  },
  listening: {
    gradient: "radial-gradient(circle at 33% 28%, #6eb3ff 0%, #0057FF 45%, #0033b3 100%)",
    shapes: [
      "70% 30% 46% 54% / 30% 50% 50% 70%",
      "30% 70% 30% 70% / 65% 30% 70% 35%",
      "55% 45% 70% 30% / 45% 65% 35% 55%",
      "70% 30% 46% 54% / 30% 50% 50% 70%",
    ],
    scale: [1, 1.14, 0.93, 1.1, 0.97, 1] as number[],
    duration: 1.1,
    glow: "0 0 70px rgba(0,87,255,0.55), 0 0 130px rgba(0,87,255,0.2)",
  },
  thinking: {
    gradient: "radial-gradient(circle at 45% 30%, #fde68a 0%, #F59E0B 50%, #92400e 100%)",
    shapes: [
      "50% 50% 50% 50% / 50% 50% 50% 50%",
      "58% 42% 58% 42% / 42% 58% 42% 58%",
      "50% 50% 50% 50% / 50% 50% 50% 50%",
    ],
    scale: [1, 1.05, 0.97, 1.03, 1] as number[],
    duration: 1.6,
    glow: "0 0 60px rgba(245,158,11,0.45)",
  },
  speaking: {
    gradient: "radial-gradient(circle at 30% 28%, #a7f3d0 0%, #22C55E 45%, #14532d 100%)",
    shapes: [
      "42% 58% 65% 35% / 58% 32% 68% 42%",
      "68% 32% 38% 62% / 38% 62% 32% 68%",
      "52% 48% 28% 72% / 28% 62% 72% 38%",
      "42% 58% 65% 35% / 58% 32% 68% 42%",
    ],
    scale: [1, 1.16, 0.90, 1.12, 0.96, 1] as number[],
    duration: 0.75,
    glow: "0 0 70px rgba(34,197,94,0.5), 0 0 120px rgba(34,197,94,0.2)",
  },
  error: {
    gradient: "radial-gradient(circle at 45% 38%, #fca5a5 0%, #EF4444 50%, #7f1d1d 100%)",
    shapes: [
      "50% 50% 50% 50% / 50% 50% 50% 50%",
      "54% 46% 54% 46% / 46% 54% 46% 54%",
      "50% 50% 50% 50% / 50% 50% 50% 50%",
    ],
    scale: [1, 1.02, 1] as number[],
    duration: 3,
    glow: "0 0 40px rgba(239,68,68,0.3)",
  },
};

export function VoiceAgent() {
  const [state, setState] = useState<AgentState>("idle");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [interimText, setInterimText] = useState(""); // live transcript while listening
  const [inputText, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [introPlayed, setIntroPlayed] = useState(false);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  // Stable ref so async callbacks always see latest messages
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Shift page content left when panel opens so nothing is obscured
  useEffect(() => {
    document.body.style.transition = "padding-right 0.24s ease";
    document.body.style.paddingRight = open ? "380px" : "0px";
    return () => {
      document.body.style.paddingRight = "0px";
    };
  }, [open]);

  // Auto-scroll chat bottom on new content
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      audioRef.current?.pause();
      abortRef.current?.abort();
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
    };
  }, []);

  // ── Scroll page to a section by ID ─────────────────────────────────────────
  const scrollToSection = useCallback((section: string | null) => {
    console.log("[VoiceAgent] scrollToSection called with:", section);
    if (!section || section === "null" || section === "none") return;

    if (section === "about") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(section);
    console.log("[VoiceAgent] element found:", el);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("voice-highlight");
    setTimeout(() => el.classList.remove("voice-highlight"), 2200);
  }, []);

  // ── Stop everything ─────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    recognitionRef.current?.abort();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    abortRef.current?.abort();
    window.speechSynthesis?.cancel();
    setInterimText("");
    setState("idle");
  }, []);

  // ── Interrupt mid-action ────────────────────────────────────────────────────
  const interrupt = useCallback(() => {
    recognitionRef.current?.abort();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    abortRef.current?.abort();
    window.speechSynthesis?.cancel();
    setInterimText("");
  }, []);

  // ── Speak text via ElevenLabs (falls back to browser TTS) ──────────────────
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
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); setState("idle"); };
      audio.onerror = () => { URL.revokeObjectURL(url); setState("idle"); };
      await audio.play();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("[VoiceAgent] TTS error:", err);
      setState("idle");
    }
  }, []);

  // ── Ask Groq with conversation history ─────────────────────────────────────
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
        const text: string = data.text ?? "I couldn't generate a response.";
        const section: string | null = data.section ?? null;
        console.log("[VoiceAgent] API response — text:", text, "| section:", section);

        setMessages((prev) => [...prev, { role: "bot", text }]);
        // Scroll page to relevant section after bot message renders
        setTimeout(() => scrollToSection(section), 300);
        await speak(text);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setErrorMsg("Something went wrong. Please try again.");
        setState("error");
      }
    },
    [speak, scrollToSection]
  );

  // ── Submit (text input or chip tap) ────────────────────────────────────────
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

  // ── Start microphone / speech recognition ───────────────────────────────────
  const startListening = useCallback(() => {
    interrupt();

    // Check browser support
    const SR =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SR) {
      setErrorMsg(
        "Voice input isn't supported in this browser. Please use Chrome or Safari, or type your question below."
      );
      setState("error");
      return;
    }

    setState("listening");
    setInterimText("");
    setErrorMsg("");

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true; // show live transcript as user speaks
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.results.length - 1; i >= 0; i--) {
        if (e.results[i].isFinal) {
          finalTranscript = e.results[i][0].transcript;
          break;
        } else {
          interim = e.results[i][0].transcript;
        }
      }
      // Show whatever we have live — final takes priority
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
      if (e.error === "no-speech") {
        setState("idle");
      } else if (e.error === "not-allowed") {
        setErrorMsg(
          "Microphone access denied. Please allow mic permission in your browser, or type your question."
        );
        setState("error");
      } else {
        setErrorMsg(`Microphone error: ${e.error}. Please type your question instead.`);
        setState("error");
      }
    };

    try {
      recognition.start();
    } catch {
      setErrorMsg("Could not start voice input. Please type your question.");
      setState("error");
    }
  }, [ask, interrupt]);

  // ── Open / close panel ──────────────────────────────────────────────────────
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

  // ── Derived values ──────────────────────────────────────────────────────────
  const blob = BLOB[state];

  const statusLabel = {
    idle: "Ready to answer",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking…",
    error: "Something went wrong",
  }[state];

  const orbColor = {
    idle: "var(--faint)",
    listening: "#0057FF",
    thinking: "#F59E0B",
    speaking: "#22C55E",
    error: "#EF4444",
  }[state];

  return (
    <>
      {/* ── Floating trigger — hidden when panel is open (panel has its own close) */}
      {!open && (
        <button
          type="button"
          aria-label="Talk to Utkarsh AI"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cta)] text-white shadow-lg hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta)] focus-visible:ring-offset-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
            <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            <line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* ── Side panel ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Utkarsh AI"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-40 flex h-screen w-[380px] flex-col border-l border-[var(--line-strong)] bg-[var(--bg-elevated)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center gap-3 border-b border-[var(--line)] px-5 py-4">
              <motion.span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: orbColor }}
                animate={
                  state !== "idle" && state !== "error"
                    ? { scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }
                    : { scale: 1, opacity: 0.3 }
                }
                transition={{ duration: state === "listening" ? 0.6 : 1.4, repeat: Infinity }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--text)]">
                  Utkarsh AI
                </p>
                <p className="text-[11px] text-[var(--faint)]">{statusLabel}</p>
              </div>
              <button
                onClick={handleClose}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[var(--faint)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 min-h-0">
              {/* Starter chips — only before first message */}
              {messages.length === 0 && state === "idle" && (
                <div>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--faint)]">
                    Ask me anything
                  </p>
                  <div className="flex flex-col gap-2">
                    {CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => submit(chip)}
                        className="rounded-full border border-[var(--line-strong)] px-4 py-2.5 text-left text-[13px] text-[var(--muted)] transition-all hover:border-[var(--cta)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message history */}
              {messages.map((msg, i) => (
                <div key={i}>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-[var(--faint)]">
                    {msg.role === "user" ? "You" : "Utkarsh"}
                  </p>
                  <p
                    className={`text-[14px] leading-relaxed ${
                      msg.role === "user" ? "text-[var(--text)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}

              {/* Live interim transcript while listening */}
              {state === "listening" && interimText && (
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-[var(--faint)]">You</p>
                  <p className="text-[14px] leading-relaxed text-[var(--text)] opacity-60 italic">
                    {interimText}
                  </p>
                </div>
              )}

              {/* Thinking dots */}
              {state === "thinking" && (
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-[var(--faint)]">Utkarsh</p>
                  <div className="flex h-5 items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[var(--faint)]"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {state === "error" && errorMsg && (
                <p className="text-[13px] text-red-400 leading-relaxed">{errorMsg}</p>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* ── 3D Blob ───────────────────────────────────────────────────── */}
            <div className="flex flex-shrink-0 items-center justify-center border-t border-[var(--line)] py-6">
              <div style={{ position: "relative", width: 144, height: 144 }}>
                {/* Blob body */}
                <motion.div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: blob.gradient,
                    boxShadow: blob.glow,
                  }}
                  animate={{
                    borderRadius: blob.shapes,
                    scale: blob.scale,
                  }}
                  transition={{
                    duration: blob.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* Specular highlight — gives the 3D sphere illusion */}
                <div
                  style={{
                    position: "absolute",
                    top: "18%",
                    left: "22%",
                    width: "28%",
                    height: "22%",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
                {/* Subtle rim light at bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "12%",
                    right: "18%",
                    width: "22%",
                    height: "14%",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* ── Input row ─────────────────────────────────────────────────── */}
            <div className="flex flex-shrink-0 items-center gap-2 border-t border-[var(--line)] px-4 py-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit(inputText);
                }}
                placeholder={state === "listening" ? "Listening — speak now…" : "Ask anything…"}
                disabled={state === "thinking"}
                className="min-w-0 flex-1 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--faint)] outline-none transition focus:border-[var(--cta)] focus:ring-1 focus:ring-[var(--cta)] disabled:opacity-50"
              />
              {/* Mic button — interrupt if speaking/thinking, toggle if listening */}
              <motion.button
                type="button"
                onClick={state === "listening" ? stopAll : startListening}
                aria-label={state === "listening" ? "Stop listening" : "Start voice input"}
                animate={
                  state === "listening"
                    ? { scale: [1, 1.1, 1] }
                    : { scale: 1 }
                }
                transition={
                  state === "listening"
                    ? { duration: 0.8, repeat: Infinity }
                    : {}
                }
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  state === "listening"
                    ? "bg-red-500 text-white"
                    : state === "thinking"
                    ? "bg-[var(--cta)] text-white opacity-70"
                    : "bg-[var(--cta)] text-white hover:opacity-90"
                }`}
              >
                {state === "listening" ? (
                  /* Stop square */
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <rect width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  /* Mic icon */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
                    <path
                      d="M5 10a7 7 0 0014 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
