import Link from "next/link";

export default function CaseStudyNotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center sm:px-8">
      <h1 className="text-[1.75rem] font-semibold text-[var(--text)]">
        Case study not found
      </h1>
      <p className="mt-3 text-[15px] text-[var(--muted)]">
        That project is not in this build.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--cta)] px-8 text-[15px] font-semibold text-[var(--cta-label)]"
      >
        Home
      </Link>
    </div>
  );
}
