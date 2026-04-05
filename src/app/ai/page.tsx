import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "AI Practices",
  description: `${site.name} — AI projects and tools built with artificial intelligence.`,
};

const aiProjects = [
  {
    id: "ai-1",
    name: "Project placeholder",
    description: "Coming soon — add your AI project description here.",
    tools: ["Claude", "Figma"],
    status: "placeholder" as const,
  },
  {
    id: "ai-2",
    name: "Project placeholder",
    description: "Coming soon — add your AI project description here.",
    tools: ["GPT-4", "Midjourney"],
    status: "placeholder" as const,
  },
];

export default function AIPage() {
  return (
    <div className="bg-[var(--bg)]">
      {/* Header */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-28 sm:px-12 sm:pb-24 sm:pt-36">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">
              AI Practices
            </p>
            <h1
              className="mt-4 max-w-[20ch] text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)]"
              style={{
                fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              }}
            >
              Tools I&apos;ve built,
              not just used.
            </h1>
            <div className="mt-8 h-px w-12 bg-[var(--cta)]" aria-hidden />
            <p className="mt-6 max-w-[42rem] text-pretty text-lg leading-[1.7] text-[var(--muted)]">
              AI isn&apos;t a shortcut in my practice — it&apos;s a medium. These are projects where I've built, prompted, and designed with AI as an active collaborator in the process.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Projects grid */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 sm:px-12 sm:py-24">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aiProjects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.06}>
              <li className="flex flex-col gap-0 overflow-hidden rounded-[1.35rem] border border-[var(--line)] border-dashed bg-[var(--surface)] p-6 sm:p-8">
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--faint)]">
                    Coming soon
                  </p>
                  <h2
                    className="mt-3 font-bold tracking-[-0.02em] text-[var(--text)]"
                    style={{
                      fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
                      fontSize: '1.2rem',
                    }}
                  >
                    {project.name}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
                    {project.description}
                  </p>
                </div>
                {/* Tool tags */}
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools used">
                  {project.tools.map((tool) => (
                    <li key={tool}>
                      <span className="inline-flex rounded-full border border-[var(--line)] px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-[var(--faint)]">
                        {tool}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ul>

        {/* Note */}
        <Reveal delay={0.15}>
          <aside className="mt-16 rounded-[1.25rem] border border-[var(--line)] bg-[var(--bg-elevated)] p-8 sm:mt-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--faint)]">
              A note on AI in my practice
            </p>
            <p className="mt-4 max-w-[56rem] text-pretty text-[17px] leading-[1.75] text-[var(--muted)]">
              I use AI to expand what's possible in research synthesis, rapid prototyping, and interaction exploration — not to replace craft or judgment. The best AI-augmented work is indistinguishable from careful design; it just gets there faster and with more creative range.
            </p>
          </aside>
        </Reveal>
      </section>
    </div>
  );
}
