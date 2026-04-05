"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import type { MiniProject } from "@/content/portfolio";
import { cn } from "@/lib/cn";

type MiniCasePanelProps = {
  project: MiniProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MiniCasePanel({
  project,
  open,
  onOpenChange,
}: MiniCasePanelProps) {
  if (!project) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/65 backdrop-blur-md",
            "transition-opacity duration-200",
            "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed z-50 flex flex-col border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] shadow-2xl outline-none backdrop-blur-2xl",
            "left-0 right-0 top-auto max-h-[min(88dvh,920px)] rounded-t-[1.5rem] border",
            "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform",
            "data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full",
            "md:bottom-0 md:left-auto md:right-0 md:top-0 md:h-full md:max-h-none md:w-full md:max-w-[440px]",
            "md:rounded-none md:rounded-l-[1.5rem] md:rounded-t-none md:border-l md:border-t-0",
            "md:data-[state=closed]:translate-x-full md:data-[state=closed]:translate-y-0",
            "md:data-[state=open]:translate-x-0",
          )}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{project.title}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {project.summary}
          </Dialog.Description>

          <div className="flex shrink-0 items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--faint)]">
              Snapshot
            </p>
            <Dialog.Close
              type="button"
              className="min-h-[44px] min-w-[44px] rounded-full text-[15px] text-[var(--muted)] transition hover:text-[var(--text)]"
              aria-label="Close"
            >
              Done
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10 pt-4">
            <div className="relative mb-7 aspect-[16/10] w-full overflow-hidden rounded-[1rem] rounded-xl border border-[var(--line)] bg-[var(--surface-elevated)]">
              <Image
                src={project.coverImage}
                alt={project.coverAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 440px"
                priority={open}
              />
            </div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text)]">
              {project.title}
            </h2>
            <p className="mt-2 text-pretty text-[15px] leading-relaxed text-[var(--muted)]">
              {project.tagline}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
              {project.tags.map((t) => (
                <li key={t}>
                  <span className="inline-flex rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-1 text-[12px] text-[var(--muted)]">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-7 grid gap-4 border-t border-[var(--line)] pt-7 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
                  Role
                </dt>
                <dd className="mt-1 text-[15px] text-[var(--text)]">{project.role}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
                  Year
                </dt>
                <dd className="mt-1 text-[15px] text-[var(--text)]">{project.year}</dd>
              </div>
              {project.highlights.map((h, idx) => (
                <div key={`${h.label}-${idx}`} className="sm:col-span-2">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
                    {h.label}
                  </dt>
                  <dd className="mt-1 text-[15px] text-[var(--text)]">{h.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-9 space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--faint)]">
                Overview
              </p>
              {project.body.map((para) => (
                <p
                  key={para.slice(0, 24)}
                  className="text-pretty text-[15px] leading-relaxed text-[var(--muted)]"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
