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
    >
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">Selected work</p>
        <h2
          id="work-heading"
          className="mt-3 text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)]"
          style={{ fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
        >
          Case studies
        </h2>
        <p className="mt-4 max-w-[40rem] text-pretty text-base leading-relaxed text-[var(--muted)]">
          {site.workIntro}
        </p>
      </Reveal>

      <ul className="mt-16 flex flex-col gap-14 sm:mt-20 sm:gap-20">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <li>
              <TiltCard maxTilt={3.5}>
                <article className="group relative">
                  <Link
                    href={`/work/${p.slug}`}
                    className="relative block overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)] ring-[var(--accent-soft)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_40px_100px_-40px_rgba(0,87,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)] sm:rounded-[2rem]"
                  >
                    <div className="relative aspect-[16/11] w-full sm:aspect-[21/10] lg:aspect-[2.35/1]">
                      <Image
                        src={p.coverImage}
                        alt={p.coverAlt}
                        fill
                        className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.03]"
                        sizes="(max-width:1024px) 100vw, 1200px"
                        priority={i === 0}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10"
                        aria-hidden
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
                        <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/60">
                          {p.year}
                          {p.client ? ` · ${p.client}` : ""}
                        </p>
                        <h3 className="mt-3 max-w-[20ch] text-balance text-[1.75rem] font-semibold leading-[1.1] tracking-tight text-white sm:max-w-[18ch] sm:text-[2.5rem] lg:text-[3rem]">
                          {p.title}
                        </h3>
                        <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-white/75 sm:text-base">
                          {p.tagline}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-[var(--cta-label)]">
                          <span className="rounded-full bg-[var(--cta)] px-5 py-2.5 shadow-lg shadow-blue-500/20 transition group-hover:bg-[var(--cta-hover)]">
                            View case study
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                  <ul
                    className="mt-5 flex flex-wrap gap-2 px-1 sm:px-2"
                    aria-label="Project focus areas"
                  >
                    {p.tags.map((t) => (
                      <li key={t}>
                        <span className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface-elevated)] px-3 py-1 text-[12px] text-[var(--muted)]">
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </TiltCard>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
