import Link from "next/link";
import { site } from "@/content/portfolio";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)]" data-cursor-label="you made it.">
      <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-12">
        {/* WoP badges */}
        <div className="mb-6 flex items-center gap-[8px]">
          <img
            src="/brand/wop-badge-silver.svg"
            alt="Wall of Portfolios Silver 2026"
            className="h-[72px] w-auto"
          />
          <img
            src="/brand/wop-badge-black.svg"
            alt="Featured on Wall of Portfolios 2026"
            className="h-8 w-auto [.dark_&]:hidden"
          />
          <img
            src="/brand/wop-badge-white.svg"
            alt="Featured on Wall of Portfolios 2026"
            className="hidden h-8 w-auto [.dark_&]:block"
          />
        </div>

        {/* Top row, name + social links */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p
              className="text-[13px] font-bold tracking-[-0.02em] text-[var(--text)]"
              style={{ fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif' }}
            >
              {site.name}
            </p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.1em] text-[var(--faint)]">
              {site.title}
            </p>
          </div>

          {/* Social links */}
          <nav aria-label="Social links">
            <ul className="flex flex-wrap items-center gap-5">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href={site.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.contact.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  Dribbble
                </a>
              </li>
              <li>
                <Link
                  href="/ai"
                  className="text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  AI Practices
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  Archive
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--faint)]">
            © {year} {site.name}
          </p>
          <p className="text-[11px] text-[var(--faint)]">
            Coded by AI. Designed by me. Architects don&apos;t pour concrete.
          </p>
        </div>
      </div>
    </footer>
  );
}
