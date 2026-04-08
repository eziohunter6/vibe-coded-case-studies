import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ArchiveGrid } from "@/components/ArchiveGrid";
import type { Photo } from "@/components/ArchiveGrid";
import { site } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Archive",
  description: `${site.name}, photography and visual archive.`,
};

const photos: Photo[] = [
  // ── Portraits ──────────────────────────────────────────────────────────────
  {
    src: "/images/archive/portrait-holi-child.png",
    alt: "Child covered in Holi colours, father behind",
    caption: "Vrindavan · 2023",
    category: "portraits",
    span: "feature",
  },
  {
    src: "/images/archive/portrait-fisherman.png",
    alt: "Fisherman mending net on the beach",
    caption: "Rameswaram · 2023",
    category: "portraits",
    span: "normal",
  },
  {
    src: "/images/archive/portrait-worker-turban.png",
    alt: "Construction worker with green checked turban",
    caption: "Rameswaram · 2023",
    category: "portraits",
    span: "normal",
  },
  {
    src: "/images/archive/portrait-old-man-child.png",
    alt: "Old man with yellow headband and child inside a haveli",
    caption: "Rajasthan · 2022",
    category: "portraits",
    span: "normal",
  },

  // ── Streets ────────────────────────────────────────────────────────────────
  {
    src: "/images/archive/street-varanasi-ghat.png",
    alt: "Blue walls of a Varanasi ghat with figures",
    caption: "Varanasi · 2022",
    category: "streets",
    span: "wide",
  },
  {
    src: "/images/archive/street-sadhu-banyan.png",
    alt: "Sadhu meditating beneath an enormous banyan tree",
    caption: "Varanasi · 2022",
    category: "streets",
    span: "normal",
  },
  {
    src: "/images/archive/street-woman-construction.png",
    alt: "Woman sitting outside a half-built house at a construction site",
    caption: "Chhattisgarh · 2022",
    category: "streets",
    span: "wide",
  },
  {
    src: "/images/archive/street-silhouette.png",
    alt: "Silhouette of a man against a crumbling white wall",
    caption: "Mumbai · 2023",
    category: "streets",
    span: "normal",
  },

  // ── Festival ───────────────────────────────────────────────────────────────
  {
    src: "/images/archive/festival-holi-temple.png",
    alt: "Holi colour burst inside an ornate temple",
    caption: "Vrindavan · 2023",
    category: "festival",
    span: "feature",
  },
  {
    src: "/images/archive/festival-holi-street.png",
    alt: "Man in white seated during Holi street celebrations",
    caption: "Vrindavan · 2023",
    category: "festival",
    span: "normal",
  },
  {
    src: "/images/archive/festival-mud-river.png",
    alt: "Children diving and splashing in an orange-brown river",
    caption: "Chhattisgarh · 2022",
    category: "festival",
    span: "normal",
  },

  // ── Landscape ──────────────────────────────────────────────────────────────
  {
    src: "/images/archive/landscape-sunset-purple.png",
    alt: "Dramatic purple and orange sunset over open water",
    caption: "Andaman Islands · 2023",
    category: "landscape",
    span: "feature",
  },
  {
    src: "/images/archive/landscape-foggy-hills.png",
    alt: "Black and white hill town wrapped in low cloud and fog",
    caption: "Sikkim · 2021",
    category: "landscape",
    span: "wide",
  },
  {
    src: "/images/archive/landscape-meadow.png",
    alt: "Wide green meadow under a dramatic blue sky with clouds",
    caption: "Kanha · 2022",
    category: "landscape",
    span: "wide",
  },
  {
    src: "/images/archive/landscape-boats-ganga.png",
    alt: "Two wooden boats moored on the Ganga at dusk",
    caption: "Varanasi · 2022",
    category: "landscape",
    span: "normal",
  },
  {
    src: "/images/archive/landscape-temple-dusk.png",
    alt: "Temple silhouette against a dark blue dusk sky by the river",
    caption: "Varanasi · 2022",
    category: "landscape",
    span: "normal",
  },
  {
    src: "/images/archive/landscape-coastal-seaweed.png",
    alt: "Green seaweed carpet on coastal rocks at golden hour",
    caption: "Rameswaram · 2023",
    category: "landscape",
    span: "normal",
  },

  // ── Form ───────────────────────────────────────────────────────────────────
  {
    src: "/images/archive/form-welder-sparks.png",
    alt: "Welder at work, blue sparks exploding in the dark",
    caption: "Delhi · 2023",
    category: "form",
    span: "normal",
  },
  {
    src: "/images/archive/form-fishermen-nets.png",
    alt: "Fishermen pulling and sorting nets on the beach",
    caption: "Rameswaram · 2023",
    category: "form",
    span: "wide",
  },
  {
    src: "/images/archive/form-metal-hands.png",
    alt: "Worker's hands holding stacked metal casting moulds",
    caption: "Jharkhand · 2022",
    category: "form",
    span: "normal",
  },
  {
    src: "/images/archive/form-water-reflection.png",
    alt: "Figure at water's edge reflected in a mirror-still surface",
    caption: "Chhattisgarh · 2022",
    category: "form",
    span: "normal",
  },
  {
    src: "/images/archive/form-bus-handrails.png",
    alt: "Geometric rows of bus handrails in black and white",
    caption: "Gurgaon · 2022",
    category: "form",
    span: "wide",
  },
  {
    src: "/images/archive/form-carved-railing.png",
    alt: "Ornate carved wooden railing inside a dark room",
    caption: "Rajasthan · 2022",
    category: "form",
    span: "wide",
  },
  {
    src: "/images/archive/form-bicycle-wall.png",
    alt: "Old bicycle leaning against a mud-brick wall and bamboo door",
    caption: "Chhattisgarh · 2022",
    category: "form",
    span: "wide",
  },
  {
    src: "/images/archive/form-bicycle-overhead.png",
    alt: "Overhead black and white view of a bicycle being held",
    caption: "India · 2022",
    category: "form",
    span: "normal",
  },
];

export default function ArchivePage() {
  return (
    <div className="bg-[var(--bg)]" data-cursor-label="I see things.">
      {/* ── Header ── */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-28 sm:px-12 sm:pb-16 sm:pt-36">
          <Reveal>
            <div className="flex items-start justify-between gap-8">
              <div className="max-w-[32rem]">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">
                  Archive
                </p>
                <h1
                  className="mt-4 font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)]"
                  style={{
                    fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
                    fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
                  }}
                >
                  Photography &amp;
                  <br />
                  the things
                  <br />
                  I notice.
                </h1>
              </div>

              {/* Right column, meta */}
              <div className="hidden shrink-0 pt-1 sm:block">
                <dl className="space-y-0 divide-y divide-[var(--line)] text-right">
                  {[
                    { label: "Frames", value: String(photos.length) },
                    { label: "Categories", value: "5" },
                    { label: "Period", value: "2021 – 2023" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5 py-3 first:pt-0">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--faint)]">
                        {label}
                      </dt>
                      <dd className="text-[22px] font-bold tabular-nums tracking-[-0.03em] text-[var(--text)]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-8 h-px w-12 bg-[var(--cta)]" aria-hidden />
            <p className="mt-5 max-w-[40rem] text-pretty text-[17px] leading-[1.75] text-[var(--muted)]">
              Framing is the same muscle as design. Here&apos;s how I see when no one&apos;s asking me to solve anything.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-0 sm:px-12">
        <ArchiveGrid photos={photos} />
      </section>
    </div>
  );
}
