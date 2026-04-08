import Image from "next/image";
import { site } from "@/content/portfolio";
import { HeroArt } from "@/components/HeroArt";
import { HeroVideo } from "@/components/HeroVideo";
import { Reveal } from "@/components/Reveal";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden border-b border-[var(--line)] pb-20 pt-32 sm:pb-28 sm:pt-40"
      aria-labelledby="hero-heading"
    >
      <HeroArt />
      <HeroVideo />
      <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-12">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--text)]">
            {site.name} · {site.title} · {site.yearsExperience}
          </p>
        </Reveal>

        <AnimatedHeadline
          id="hero-heading"
          text={site.heroLead}
          initialDelay={0.1}
          className="mt-5 max-w-[18ch] text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)] sm:max-w-[22ch]"
          style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
          }}
        />

        <Reveal delay={0.3}>
          <div className="mt-10 h-px w-12 bg-[var(--cta)]" aria-hidden />
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mt-6 max-w-[38rem] text-pretty text-lg leading-[1.65] text-[var(--text)] opacity-80 sm:text-xl">
            {site.heroSupporting}
          </p>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            {site.heroRibbon}
          </p>
          {/* Company logo strip */}
          <div className="mt-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--faint)]">
              Previously at
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-5">
              {site.brandMarks.map((brand) => (
                <span key={brand.alt} className="block">
                  <Image
                    src={brand.srcLight}
                    alt={brand.alt}
                    width={96}
                    height={32}
                    className="h-6 w-auto object-contain opacity-50 sm:h-7 sm:opacity-60 [.dark_&]:hidden"
                  />
                  <Image
                    src={brand.srcDark}
                    alt={brand.alt}
                    width={96}
                    height={32}
                    className="hidden h-6 w-auto object-contain opacity-50 sm:h-7 sm:opacity-60 [.dark_&]:block"
                  />
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
