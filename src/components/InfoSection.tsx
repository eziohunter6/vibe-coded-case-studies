import { Reveal } from "@/components/Reveal";

const facts = [
  { label: "Experience", value: "6+ years" },
  { label: "Current role", value: "Sr. Product Designer · Spinny" },
  { label: "Location", value: "Gurgaon, India" },
  { label: "Focus", value: "Commerce · Operations · Systems" },
  { label: "Available for", value: "Senior IC · Design Lead roles" },
];

export function InfoSection() {
  return (
    <section
      id="info"
      aria-labelledby="info-heading"
      className="border-t border-[var(--line)]"
      data-cursor-label="that's me."
    >
      <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-12 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-24">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">
              About
            </p>
            <h2
              id="info-heading"
              className="mt-3 text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)]"
              style={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              }}
            >
              Designer. Researcher. Deep thinker.
            </h2>
            <p className="mt-6 max-w-[44rem] text-pretty text-[17px] leading-[1.75] text-[var(--muted)]">
              I've spent 6+ years designing consumer-facing products, from high-stakes commerce flows to complex logistics dashboards. My process starts with research, moves through systems thinking, and ends in interfaces that earn trust under real-world pressure.
            </p>
            <p className="mt-4 max-w-[44rem] text-pretty text-[17px] leading-[1.75] text-[var(--muted)]">
              I don't just follow briefs, I reframe them. Good design, to me, begins before the first pixel and persists long after the last release.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="min-w-[220px] space-y-0 divide-y divide-[var(--line)]">
              {facts.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 py-4 first:pt-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--faint)]">
                    {label}
                  </dt>
                  <dd className="text-[14px] text-[var(--text)]">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
