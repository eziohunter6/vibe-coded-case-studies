import { site } from "@/content/portfolio";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";

export function ContactBand() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-[var(--line)] bg-[var(--bg-elevated)]"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-12 sm:py-28">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">
            Get in touch
          </p>
          <h2
            id="contact-heading"
            className="mt-5 max-w-[14ch] text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)]"
            style={{
              fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            }}
          >
            Let&apos;s talk.
          </h2>
          <p className="mt-6 max-w-[36rem] text-pretty text-lg leading-relaxed text-[var(--muted)]">
            {site.contactIntro}
          </p>
          <p className="mt-3 text-[14px] text-[var(--faint)]">{site.location}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticButton strength={0.22}>
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--cta)] px-8 text-[14px] font-semibold uppercase tracking-[0.06em] text-[var(--cta-label)] transition hover:bg-[var(--cta-hover)]"
              >
                Email
              </a>
            </MagneticButton>
            <MagneticButton strength={0.22}>
              <a
                href={site.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--line-strong)] px-8 text-[14px] font-medium uppercase tracking-[0.06em] text-[var(--text)] transition hover:bg-[var(--surface-elevated)]"
              >
                LinkedIn
              </a>
            </MagneticButton>
            <MagneticButton strength={0.22}>
              <a
                href={site.contact.dribbble}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--line-strong)] px-8 text-[14px] font-medium uppercase tracking-[0.06em] text-[var(--text)] transition hover:bg-[var(--surface-elevated)]"
              >
                Dribbble
              </a>
            </MagneticButton>
            <MagneticButton strength={0.22}>
              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Coffee+Chat+with+Utkarsh+Raj&add=utkarshraj7540@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--line-strong)] px-8 text-[14px] font-medium uppercase tracking-[0.06em] text-[var(--text)] transition hover:bg-[var(--surface-elevated)]"
              >
                Send coffee ☕
              </a>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
