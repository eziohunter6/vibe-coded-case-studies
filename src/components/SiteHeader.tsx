"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/portfolio";
import { ScrambleText } from "@/components/ScrambleText";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_SECTIONS = [
  { href: "/#work", label: "Work", sectionId: "work" },
  { href: "/ai", label: "AI", sectionId: null },
  { href: "/archive", label: "Archive", sectionId: null },
  { href: "/#contact", label: "Contact", sectionId: "contact" },
] as const;

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string>("/");

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
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between px-6 sm:h-14 sm:px-12">
        {/* Name with scramble effect */}
        <Link
          href="https://utk-folio.vercel.app/"
          className="font-black uppercase tracking-[-0.02em] text-[var(--text)] transition-opacity hover:opacity-60"
          style={{ fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif', fontSize: '15px' }}
        >
          <ScrambleText text={site.name} />
        </Link>

        <div className="flex items-center gap-1">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-0.5">
              {NAV_SECTIONS.map(({ href, label, sectionId }) => (
                <li key={href}>
                  <Link
                    href={href}
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

          {/* Theme toggle */}
          <ThemeToggle className="ml-1" />

          {/* ⌘K trigger */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              );
            }}
            className="ml-1 flex items-center gap-1 rounded-lg border border-[var(--line)] px-2 py-1.5 text-[11px] font-medium text-[var(--faint)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--muted)]"
            aria-label="Open command palette"
          >
            <kbd className="font-sans">⌘</kbd>
            <kbd className="font-sans">K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
