import Link from "next/link";
import { site } from "@/content/portfolio";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-12">
        {/* Top row — name + social links */}
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
            © {year} {site.name}. Motion respects reduced‑motion settings.
          </p>
          <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--faint)]">
            Helvetica Neue · Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
