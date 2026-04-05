"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { projects, site } from "@/content/portfolio";

type Cmd = {
  id: string;
  label: string;
  category: string;
  action: string;
  external?: boolean;
};

const baseCommands: Cmd[] = [
  { id: "home", label: "Go home", category: "Navigate", action: "/" },
  { id: "work", label: "Jump to Work", category: "Navigate", action: "/#work" },
  { id: "ai", label: "AI Practices", category: "Navigate", action: "/ai" },
  { id: "archive", label: "Archive / Photography", category: "Navigate", action: "/archive" },
  {
    id: "contact",
    label: "Jump to Contact",
    category: "Navigate",
    action: "/#contact",
  },
  {
    id: "email",
    label: `Email ${site.name}`,
    category: "Connect",
    action: `mailto:${site.contact.email}`,
    external: true,
  },
  {
    id: "linkedin",
    label: "Open LinkedIn",
    category: "Connect",
    action: site.contact.linkedin,
    external: true,
  },
  {
    id: "dribbble",
    label: "Open Dribbble",
    category: "Connect",
    action: site.contact.dribbble,
    external: true,
  },
];

const projectCommands: Cmd[] = projects
  .filter((p) => p.format === "extended")
  .map((p) => ({
    id: `project-${p.slug}`,
    label: p.title,
    category: "Case study",
    action: `/work/${p.slug}`,
  }));

const ALL_COMMANDS: Cmd[] = [...baseCommands, ...projectCommands];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const reduce = useReducedMotion();

  const filtered = ALL_COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()),
  );

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Reset active index on query change
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-active="true"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const execute = (cmd: Cmd) => {
    setOpen(false);
    if (cmd.external) {
      window.open(
        cmd.action,
        cmd.action.startsWith("mailto") ? "_self" : "_blank",
        "noopener noreferrer",
      );
    } else {
      router.push(cmd.action);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[active]) execute(filtered[active]);
    }
  };

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="palette-overlay"
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.15 }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            key="palette-panel"
            className="fixed left-1/2 top-[18dvh] z-[101] w-[min(calc(100vw-2rem),520px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--surface-elevated)_96%,transparent)] shadow-[0_48px_140px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 0.97, y: reduce ? 0 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: reduce ? 0 : -10 }}
            transition={transition}
          >
            {/* Search row */}
            <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3.5">
              <svg
                className="h-[18px] w-[18px] shrink-0 text-[var(--faint)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search…"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--faint)]"
                aria-label="Search commands"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="shrink-0 rounded-md border border-[var(--line)] px-1.5 py-0.5 text-[11px] leading-none text-[var(--faint)]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <ul
              ref={listRef}
              className="max-h-[min(360px,60dvh)] overflow-y-auto p-1.5"
              role="listbox"
              aria-label="Commands"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-10 text-center text-[14px] text-[var(--faint)]">
                  No commands found
                </li>
              ) : (
                filtered.map((cmd, i) => (
                  <li
                    key={cmd.id}
                    role="option"
                    aria-selected={i === active}
                    data-active={i === active}
                    className={`flex cursor-default items-center justify-between rounded-xl px-4 py-2.5 transition-colors ${
                      i === active
                        ? "bg-[var(--surface-elevated)] text-[var(--text)]"
                        : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                    }`}
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setActive(i)}
                  >
                    <span className="text-[14px]">{cmd.label}</span>
                    <span className="ml-4 shrink-0 text-[11px] text-[var(--faint)]">
                      {cmd.category}
                    </span>
                  </li>
                ))
              )}
            </ul>

            {/* Footer hint */}
            <div className="flex items-center gap-4 border-t border-[var(--line)] px-4 py-2">
              {[
                { key: "↑↓", label: "navigate" },
                { key: "↵", label: "open" },
              ].map(({ key, label }) => (
                <span key={key} className="text-[11px] text-[var(--faint)]">
                  <kbd className="mr-1 rounded border border-[var(--line)] px-1 py-0.5 text-[10px]">
                    {key}
                  </kbd>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
