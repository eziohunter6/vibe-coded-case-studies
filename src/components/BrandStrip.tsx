import { Reveal } from "@/components/Reveal";

const companies = [
  "Spinny",
  "MakeMyTrip",
  "Juspay",
  "Deloitte",
];

export function BrandStrip() {
  return (
    <Reveal>
      <section
        aria-label="Companies worked with"
        className="border-t border-[var(--line)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--faint)]">
            Worked alongside teams at
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            {companies.map((name) => (
              <li key={name}>
                <span
                  className="text-[1.5rem] font-black uppercase tracking-[-0.03em] text-[var(--text)] opacity-15 transition-opacity duration-300 hover:opacity-60"
                  style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
                >
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Reveal>
  );
}
