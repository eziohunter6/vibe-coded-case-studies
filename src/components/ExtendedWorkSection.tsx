import Image from "next/image";
import Link from "next/link";
import type { ExtendedProject } from "@/content/portfolio";
import { site } from "@/content/portfolio";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

export function ExtendedWorkSection({
  projects,
}: {
  projects: ExtendedProject[];
}) {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto max-w-[1440px] px-6 pb-8 pt-4 sm:px-12 sm:pt-8 sm:pb-12"
      data-cursor-label="real work."
    >
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">Selected work</p>
        <h2
          id="work-heading"
          className="mt-3 text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)]"
          style={{ fontFamily: '"Inter", system-ui, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
        >
          Case studies
        </h2>
        <p className="mt-4 max-w-[40rem] text-pretty text-base leading-relaxed text-[var(--muted)]">
          {site.workIntro}
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <li>
              <TiltCard maxTilt={3.5}>
                <article className="group">
                  <Link
                    href={`/work/${p.slug}`}
                    data-cursor-label="read the full story"
                    className="flex flex-col overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_40px_100px_-40px_rgba(0,87,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)] sm:rounded-[1.75rem]"
                  >
                    {/* Image */}
                    <span className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-elevated)]">
                      <Image
                        src={p.coverImage}
                        alt={p.coverAlt}
                        fill
                        className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.03]"
                        sizes="(max-width:640px) 100vw, 50vw"
                        priority={i === 0}
                      />
                      <span
                        className="pointer-events-none absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }}
                        aria-hidden
                      />
                    </span>

                    {/* Text */}
                    <span className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
                      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">
                        {p.year}{p.client ? ` · ${p.client}` : ""}
                      </span>
                      <span className="text-[1.35rem] font-semibold leading-[1.15] tracking-tight text-[var(--text)] sm:text-[1.5rem]">
                        {p.title}
                      </span>
                      {/* Tags, below heading */}
                      <span className="flex flex-wrap gap-1.5 pt-0.5" aria-label="Project focus areas">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex rounded-full border border-[var(--line-strong)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]"
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                      <span className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-[var(--muted)]">
                        {p.tagline}
                      </span>
                      <span className="mt-auto pt-3 flex items-center gap-1 text-[13px] font-medium text-[var(--cta)]">
                        View case study
                        <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                      </span>
                    </span>
                  </Link>
                </article>
              </TiltCard>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
