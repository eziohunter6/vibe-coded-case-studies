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

      <ul className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <li>
              <TiltCard maxTilt={3.5}>
                <article className="group relative">
                  <Link
                    href={`/work/${p.slug}`}
                    className="relative block overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_40px_100px_-40px_rgba(0,87,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)] sm:rounded-[1.75rem]"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={p.coverImage}
                        alt={p.coverAlt}
                        fill
                        className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.03]"
                        sizes="(max-width:640px) 100vw, 50vw"
                        priority={i === 0}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/5"
                        aria-hidden
                      />
                      {/* Tags — top-left inside card */}
                      <ul className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-4 sm:p-5" aria-label="Project focus areas">
                        {p.tags.map((t) => (
                          <li key={t}>
                            <span className="inline-flex rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur-sm">
                              {t}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">
                          {p.year}
                          {p.client ? ` · ${p.client}` : ""}
                        </p>
                        <h3 className="mt-2 max-w-[22ch] text-balance text-[1.35rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-[1.6rem]">
                          {p.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 max-w-sm text-[13px] leading-relaxed text-white/70">
                          {p.tagline}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--cta-label)]">
                          <span className="rounded-full bg-[var(--cta)] px-4 py-2 shadow-lg shadow-blue-500/20 transition group-hover:bg-[var(--cta-hover)]">
                            View case study
                          </span>
                        </span>
                      </div>
                    </div>
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
