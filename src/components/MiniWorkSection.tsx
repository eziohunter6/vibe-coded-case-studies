"use client";

import Image from "next/image";
import { useState } from "react";
import type { MiniProject } from "@/content/portfolio";
import { site } from "@/content/portfolio";
import { MiniCasePanel } from "@/components/MiniCasePanel";
import { Reveal } from "@/components/Reveal";

export function MiniWorkSection({ projects }: { projects: MiniProject[] }) {
  const [active, setActive] = useState<MiniProject | null>(null);
  const [open, setOpen] = useState(false);

  const openProject = (p: MiniProject) => {
    setActive(p);
    setOpen(true);
  };

  const onPanelOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      window.setTimeout(() => setActive(null), 380);
    }
  };

  return (
    <>
      <section
        id="mini-work"
        aria-labelledby="mini-work-heading"
        className="mx-auto max-w-[1440px] px-6 pb-20 sm:px-12"
      >
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">Additional work</p>
          <h2
            id="mini-work-heading"
            className="mt-3 text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)]"
            style={{ fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          >
            More projects
          </h2>
          <p className="mt-4 max-w-[40rem] text-pretty text-base leading-relaxed text-[var(--muted)]">
            {site.miniIntro}
          </p>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <li>
                <button
                  type="button"
                  className="group flex w-full flex-col overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface)] text-left shadow-[0_0_0_0_transparent] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                  onClick={() => openProject(p)}
                >
                  <span className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-elevated)]">
                    <Image
                      src={p.coverImage}
                      alt=""
                      fill
                      className="object-cover transition duration-[1.1s] ease-out group-hover:scale-[1.04]"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                    <span
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                      }}
                    />
                  </span>
                  <span className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
                    <span className="text-[12px] uppercase tracking-[0.16em] text-[var(--faint)]">
                      {p.year}
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-[var(--text)] sm:text-xl">
                      {p.title}
                    </span>
                    <span className="line-clamp-2 text-[15px] leading-relaxed text-[var(--muted)]">
                      {p.summary}
                    </span>
                    <span className="mt-2 flex items-center gap-1 text-[14px] font-medium text-[var(--cta)]">
                      Open
                      <span aria-hidden className="transition group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>
      <MiniCasePanel
        project={active}
        open={open}
        onOpenChange={onPanelOpenChange}
      />
    </>
  );
}
