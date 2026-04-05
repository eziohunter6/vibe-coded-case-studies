import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExtendedBySlug, getExtendedProjects } from "@/content/portfolio";
import { ParallaxLayer } from "@/components/ParallaxLayer";
import { Reveal } from "@/components/Reveal";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getExtendedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getExtendedBySlug(slug);
  if (!project) return { title: "Case study" };
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getExtendedBySlug(slug);
  if (!project) notFound();

  return (
    <article className="bg-[var(--bg)]">
      {/* Reading progress */}
      <ScrollProgressBar />

      {/* Hero */}
      <div className="relative min-h-[72svh] w-full overflow-hidden sm:min-h-[78svh]">
        <div className="absolute inset-0">
          <ParallaxLayer className="relative h-[115%] w-full" yRange={[-32, 32]}>
            <Image
              src={project.heroImage}
              alt={project.heroAlt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </ParallaxLayer>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/55 to-transparent sm:via-[var(--bg)]/35"
          aria-hidden
        />
        <div className="grain opacity-[0.07]" aria-hidden />

        <div className="relative z-10 flex min-h-[72svh] flex-col justify-end sm:min-h-[78svh]">
          <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 pt-24 sm:px-12 sm:pb-16 sm:pt-28">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--muted)]">
                <li>
                  <Link href="/" className="transition hover:text-[var(--text)]">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[var(--faint)]">
                  /
                </li>
                <li className="text-[var(--text)]">Case study</li>
              </ol>
            </nav>
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/55">
              {project.year}
              {project.client ? ` · ${project.client}` : ""}
            </p>
            <h1 className="mt-4 max-w-[18ch] text-balance font-bold leading-[1.0] tracking-[-0.04em] text-white sm:max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif' }}>
              {project.title}
            </h1>
            <p className="mt-6 max-w-[40rem] text-pretty text-lg leading-relaxed text-white/78 sm:text-xl">
              {project.tagline}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Focus">
              {project.tags.map((t) => (
                <li key={t}>
                  <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] text-white/85 backdrop-blur-sm">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Metrics — numbers count up on scroll */}
      {project.metrics?.length ? (
        <div className="border-y border-[var(--line)] bg-[var(--bg-elevated)]">
          <div className="mx-auto grid max-w-[1440px] divide-y divide-[var(--line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {project.metrics.map((m) => (
              <div key={m.label} className="px-6 py-8 sm:px-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--faint)]">
                  {m.label}
                </p>
                <p className="mt-2 text-[17px] font-medium text-[var(--text)]">
                  <AnimatedNumber value={m.value} />
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Body */}
      <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="text-pretty text-xl leading-relaxed text-[var(--muted)] sm:text-[1.35rem] sm:leading-[1.6]">
            {project.intro}
          </p>
        </Reveal>

        {project.pullQuote ? (
          <Reveal>
            <figure className="my-16 border-l-2 border-[var(--cta)] pl-8 sm:my-20">
              <blockquote className="text-balance text-[1.35rem] font-medium leading-snug tracking-tight text-[var(--text)] sm:text-[1.5rem]">
                "{project.pullQuote.text}"
              </blockquote>
              {project.pullQuote.attribution ? (
                <figcaption className="mt-4 text-[14px] text-[var(--muted)]">
                  — {project.pullQuote.attribution}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        ) : null}

        <div className="mt-12 space-y-24 sm:mt-16 sm:space-y-28">
          {project.sections.map((block, i) => (
            <Reveal key={block.id} delay={i * 0.03}>
              <section aria-labelledby={`section-${block.id}`}>
                <h2
                  id={`section-${block.id}`}
                  className="font-bold tracking-[-0.03em] text-[var(--text)]"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif' }}
                >
                  {block.title}
                </h2>
                <div className="mt-6 space-y-5">
                  {block.paragraphs.map((p) => (
                    <p
                      key={p.slice(0, 36)}
                      className="text-pretty text-[17px] leading-[1.7] text-[var(--muted)]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                {block.image ? (
                  <div
                    className={
                      block.emphasis
                        ? "mt-12 -mx-5 sm:-mx-[max(0px,calc((100vw-720px)/2-2rem)))]"
                        : "mt-12"
                    }
                  >
                    <div
                      className={
                        block.emphasis
                          ? "mx-auto max-w-[1200px] overflow-hidden rounded-[1.25rem] border border-[var(--line)] sm:rounded-[1.75rem]"
                          : "overflow-hidden rounded-[1.25rem] border border-[var(--line)]"
                      }
                    >
                      <ParallaxLayer
                        className="relative aspect-[16/10] w-full sm:aspect-[2/1]"
                        yRange={[-14, 14]}
                      >
                        <Image
                          src={block.image}
                          alt={block.imageAlt ?? ""}
                          fill
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, 1200px"
                        />
                      </ParallaxLayer>
                    </div>
                  </div>
                ) : null}
              </section>
            </Reveal>
          ))}
        </div>

        {project.reflection?.length ? (
          <aside className="mt-24 rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 sm:mt-28 sm:p-10">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--faint)]">
              Reflection
            </h2>
            <ul className="mt-6 list-none space-y-4 text-[17px] leading-[1.65] text-[var(--muted)]">
              {project.reflection.map((line) => (
                <li key={line.slice(0, 48)}>{line}</li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div className="mt-20 border-t border-[var(--line)] pt-12">
          <Link
            href="/#work"
            className="inline-flex min-h-12 items-center rounded-full border border-[var(--line-strong)] px-6 text-[15px] font-medium text-[var(--text)] transition hover:bg-[var(--surface-elevated)]"
          >
            ← All work
          </Link>
        </div>
      </div>
    </article>
  );
}
