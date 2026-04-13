"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export type PhotoCategory = "portraits" | "streets" | "festival" | "landscape" | "form";
export type PhotoSpan = "normal" | "wide" | "feature";

export type Photo = {
  src: string;
  alt: string;
  caption: string;
  category: PhotoCategory;
  span: PhotoSpan;
};

type ActiveCategory = "all" | PhotoCategory;

const CATEGORY_META: { id: ActiveCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "portraits", label: "Portraits" },
  { id: "streets", label: "Streets" },
  { id: "festival", label: "Festival" },
  { id: "landscape", label: "Landscape" },
  { id: "form", label: "Form" },
];

const CATEGORY_ORDER: PhotoCategory[] = [
  "portraits", "streets", "festival", "landscape", "form",
];

const SECTION_DESCRIPTIONS: Record<PhotoCategory, string> = {
  portraits: "Faces that held still long enough to be seen.",
  streets: "India observed at eye level.",
  festival: "Colour as ritual.",
  landscape: "Light before it changes.",
  form: "The geometry inside ordinary things.",
};

const spanCol: Record<PhotoSpan, string> = {
  normal: "col-span-1",
  wide:   "col-span-2",
  feature:"col-span-2",
};

const PHOTO_CURSOR_LABELS = [
  "held still",
  "almost missed",
  "the light knew",
  "one frame",
  "kept this one",
  "nobody else saw",
  "right after",
  "stayed for this",
];

const spanAspect: Record<PhotoSpan, string> = {
  normal:  "aspect-[3/4]",
  wide:    "aspect-[16/9]",
  feature: "aspect-[4/3]",
};

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({
  photos, index, onClose, onNext, onPrev,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/96"
      onClick={onClose}
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={1200}
          height={900}
          className="max-h-[85vh] w-auto max-w-[88vw] object-contain"
          priority
        />
        <div className="mt-4 flex w-full items-center justify-between px-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/50">
            {photo.caption}
          </p>
          <p className="text-[11px] tabular-nums text-white/30">
            {index + 1} / {photos.length}
          </p>
        </div>
      </motion.div>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </motion.div>
  );
}

// ── Photo Cell ─────────────────────────────────────────────────────────────────

function PhotoCell({ photo, onClick, index }: { photo: Photo; onClick: () => void; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cursorLabel = PHOTO_CURSOR_LABELS[index % PHOTO_CURSOR_LABELS.length];
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-label={cursorLabel}
      className={`${spanCol[photo.span]} ${spanAspect[photo.span]} group relative w-full overflow-hidden bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta)]`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/10 to-transparent p-3"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/75">
              {photo.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────

function SectionHeader({ index, category, count }: {
  index: number;
  category: PhotoCategory;
  count: number;
}) {
  return (
    <div className="col-span-full mt-20 flex items-end justify-between border-t border-[var(--line)] pt-8 first:mt-0">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--faint)]">
          {String(index + 1).padStart(2, "0")} , , 
        </p>
        <h2
          className="mt-2 font-bold leading-[1.0] tracking-[-0.03em] text-[var(--text)]"
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
          }}
        >
          {CATEGORY_ORDER[index].charAt(0).toUpperCase() + CATEGORY_ORDER[index].slice(1)}
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">
          {SECTION_DESCRIPTIONS[category]}
        </p>
      </div>
      <p className="mb-1 shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
        {count} {count === 1 ? "frame" : "frames"}
      </p>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export function ArchiveGrid({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<ActiveCategory>("all");
  const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((contextPhotos: Photo[], idx: number) => {
    setLightboxPhotos(contextPhotos);
    setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextPhoto = useCallback(() =>
    setLightboxIndex((i) => i === null ? null : (i + 1) % lightboxPhotos.length),
  [lightboxPhotos.length]);
  const prevPhoto = useCallback(() =>
    setLightboxIndex((i) => i === null ? null : (i - 1 + lightboxPhotos.length) % lightboxPhotos.length),
  [lightboxPhotos.length]);

  const categoryCounts = Object.fromEntries(
    CATEGORY_ORDER.map((cat) => [cat, photos.filter((p) => p.category === cat).length])
  ) as Record<PhotoCategory, number>;

  const filteredPhotos = active === "all" ? photos : photos.filter((p) => p.category === active);

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="sticky top-[3.5rem] z-30 -mx-6 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] px-6 backdrop-blur-xl sm:-mx-12 sm:px-12">
        <div className="flex items-center overflow-x-auto py-3 [scrollbar-width:none]">
          {CATEGORY_META.map(({ id, label }) => {
            const count = id === "all" ? photos.length : categoryCounts[id as PhotoCategory];
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all sm:py-1.5 ${
                  isActive
                    ? "bg-[var(--text)] text-[var(--bg)]"
                    : "text-[var(--faint)] hover:text-[var(--text)]"
                }`}
              >
                {label}
                <span className={`tabular-nums text-[10px] ${isActive ? "opacity-50" : "opacity-40"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="mt-8">
        {active === "all" ? (
          CATEGORY_ORDER.map((cat, idx) => {
            const catPhotos = photos.filter((p) => p.category === cat);
            return (
              <div key={cat}>
                <SectionHeader index={idx} category={cat} count={catPhotos.length} />
                <div className="mt-4 grid grid-cols-2 gap-[3px] sm:grid-cols-4">
                  {catPhotos.map((photo, i) => (
                    <PhotoCell
                      key={photo.src}
                      photo={photo}
                      index={i}
                      onClick={() => openLightbox(catPhotos, i)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-2 gap-[3px] sm:grid-cols-4">
            {filteredPhotos.map((photo, i) => (
              <PhotoCell
                key={photo.src}
                photo={photo}
                index={i}
                onClick={() => openLightbox(filteredPhotos, i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={lightboxPhotos}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextPhoto}
            onPrev={prevPhoto}
          />
        )}
      </AnimatePresence>
    </>
  );
}
