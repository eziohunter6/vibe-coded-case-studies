"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      {open ? (
        <>
          <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
}

const NAV_SECTIONS = [
  { href: "/#work", label: "Work", sectionId: "work", cursorLabel: "see the work" },
  { href: "/ai", label: "AI Practices", sectionId: null, cursorLabel: "experiments" },
  { href: "/#info", label: "Info", sectionId: "info", cursorLabel: "the person" },
  { href: "/archive", label: "Archive", sectionId: null, cursorLabel: "the eye" },
  { href: "/#contact", label: "Contact", sectionId: "contact", cursorLabel: "say hello" },
] as const;

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string>("/");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  // Track which section is in view (home page only)
  useEffect(() => {
    const ids = NAV_SECTIONS
      .map((s) => s.sectionId)
      .filter(Boolean) as string[];

    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "-20% 0px -65% 0px",
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function isActive(href: string, sectionId: string | null): boolean {
    if (sectionId && activeSection === sectionId) return true;
    if (!sectionId && activePath === href) return true;
    return false;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-2xl backdrop-saturate-150" data-cursor-label="find your way.">
      <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between px-6 sm:h-14 sm:px-12">
        <Link
          href="/"
          className="text-3xl font-bold tracking-tight transition-opacity hover:opacity-60"
          style={{ fontFamily: '"Inter", system-ui, sans-serif', color: 'var(--text)', textDecoration: 'none' }}
          suppressHydrationWarning
        >
          utk<sup>®</sup>
        </Link>

        <div className="flex items-center gap-1">
          {/* Nav links, desktop only */}
          <nav aria-label="Primary" className="hidden sm:block">
            <ul className="flex items-center gap-0.5">
              {NAV_SECTIONS.map(({ href, label, sectionId, cursorLabel }) => (
                <li key={href}>
                  <Link
                    href={href}
                    data-cursor-label={cursorLabel}
                    className={`relative rounded-full px-3.5 py-2 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors sm:px-4 ${
                      isActive(href, sectionId)
                        ? "text-[var(--text)]"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {label}
                    {isActive(href, sectionId) && (
                      <span className="absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[var(--cta)]" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle className="ml-1" />

          {/* ⌘K, desktop only */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              );
            }}
            className="ml-1 hidden items-center gap-1 rounded-lg border border-[var(--line)] px-2 py-1.5 text-[11px] font-medium text-[var(--faint)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--muted)] sm:flex"
            aria-label="Open command palette"
          >
            <kbd className="font-sans">⌘</kbd>
            <kbd className="font-sans">K</kbd>
          </button>

          {/* Hamburger, mobile only */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--text)] sm:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_96%,transparent)] backdrop-blur-2xl">
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col px-6 py-2">
              {NAV_SECTIONS.map(({ href, label, sectionId, cursorLabel }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    data-cursor-label={cursorLabel}
                    className={`flex items-center justify-between border-b border-[var(--line)] py-4 text-[15px] font-medium last:border-0 transition-colors ${
                      isActive(href, sectionId)
                        ? "text-[var(--text)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {label}
                    {isActive(href, sectionId) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--cta)]" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
