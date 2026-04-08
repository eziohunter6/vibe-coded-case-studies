import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "AI Practices",
  description: `${site.name} — AI projects and tools built with artificial intelligence.`,
};

const aiProjects = [
  {
    id: "mood-synthesiser",
    name: "Mood Synthesiser",
    href: "https://mood-synthesizer.vercel.app/",
    thumbnailLight: "/images/ai-practices/mood-synthesiser-light.png",
    thumbnailDark: "/images/ai-practices/mood-synthesiser-dark.png",
  },
  {
    id: "roast-my-code",
    name: "Roast My Code",
    href: "https://roast-any-code.vercel.app/",
    thumbnailLight: "/images/ai-practices/roast-my-code-light.png",
    thumbnailDark: "/images/ai-practices/roast-my-code-dark.png",
  },
  {
    id: "grid-therapist",
    name: "The Grid Therapist",
    href: "https://grid-therapist.vercel.app/",
    thumbnailLight: "/images/ai-practices/grid-therapist-light.png",
    thumbnailDark: "/images/ai-practices/grid-therapist-dark.png",
  },
  {
    id: "silence-meter",
    name: "The Silence Meter",
    href: "https://silence-meter.vercel.app/",
    thumbnailLight: "/images/ai-practices/silence-meter-light.png",
    thumbnailDark: "/images/ai-practices/silence-meter-dark.png",
  },
];

export default function AIPage() {
  return (
    <div className="bg-[var(--bg)]">
      {/* Header */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-20 sm:px-12 sm:pb-24 sm:pt-36">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">
              AI + Prototyping
            </p>
            <h1
              className="mt-4 max-w-[20ch] text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)]"
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              }}
            >
              Tools I&apos;ve built,
              not just used.
            </h1>
            <div className="mt-8 h-px w-12 bg-[var(--cta)]" aria-hidden />
            <p className="mt-6 max-w-[42rem] text-pretty text-lg leading-[1.7] text-[var(--muted)]">
              The fastest way to understand a design material is to build with it, not just specify it.
              These tools came out of a deliberate practice: pick a problem, write the spec, prototype
              with AI as a collaborator, and ship. Not to add to a portfolio — to train the muscle.
            </p>
            <p className="mt-4 max-w-[42rem] text-pretty text-lg leading-[1.7] text-[var(--muted)]">
              Each one sharpened something different: how to prompt for outcomes not output, how to
              design graceful fallbacks when the model is wrong, and how to build experiences that
              feel intentional rather than generated. Four projects. One methodology: AI&nbsp;+&nbsp;Prototyping.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Projects grid */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 sm:px-12 sm:py-24">
        <ul className="grid gap-5 sm:grid-cols-2">
          {aiProjects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.06}>
              <li className="overflow-hidden rounded-[1.35rem]">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.name}`}
                  className="group relative block w-full overflow-hidden rounded-[1.35rem]"
                >
                  {/* Light thumbnail — hidden when .dark class is active */}
                  <Image
                    src={project.thumbnailLight}
                    alt={project.name}
                    width={1200}
                    height={750}
                    className="w-full [.dark_&]:hidden"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  {/* Dark thumbnail — only shown when .dark class is active */}
                  <Image
                    src={project.thumbnailDark}
                    alt={project.name}
                    width={1200}
                    height={750}
                    className="hidden w-full [.dark_&]:block"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 rounded-[1.35rem]" />
                </a>
              </li>
            </Reveal>
          ))}
        </ul>

        {/* Note */}
        <Reveal delay={0.15}>
          <aside className="mt-16 rounded-[1.25rem] border border-[var(--line)] bg-[var(--bg-elevated)] p-8 sm:mt-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--faint)]">
              A note on how I use AI
            </p>
            <p className="mt-4 max-w-[56rem] text-pretty text-[17px] leading-[1.75] text-[var(--muted)]">
              Prompting is a design skill. I treat AI systems the way I treat any collaborator —
              with a clear brief, fast iteration loops, and critical judgment on the output.
              The best AI-augmented work doesn&apos;t look like it was generated; it looks like
              someone made sharp decisions quickly. That&apos;s what I&apos;m building toward.
            </p>
          </aside>
        </Reveal>
      </section>
    </div>
  );
}
