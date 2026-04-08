import Image from "next/image";
import { site } from "@/content/portfolio";
import { HeroArt } from "@/components/HeroArt";
import { HeroVideo } from "@/components/HeroVideo";
import { Reveal } from "@/components/Reveal";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden border-b border-[var(--line)] pb-20 pt-24 sm:pb-32 sm:pt-40"
      aria-labelledby="hero-heading"
      data-cursor-label="start here."
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
          className="mt-5 max-w-[20ch] text-balance font-bold leading-[1.05] tracking-[-0.04em] text-[var(--text)] sm:max-w-[24ch]"
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 'clamp(1.92rem, 4.4vw, 4rem)',
          }}
        />

        <Reveal delay={0.3}>
          <p className="mt-6 max-w-[32rem] text-pretty text-[15px] leading-[1.75] text-[var(--text)] opacity-80">
            {site.heroSupporting[0]}<br />{site.heroSupporting[1]}
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
                    width={360}
                    height={80}
                    sizes="128px"
                    className="h-6 w-auto object-contain opacity-55 sm:h-7 sm:opacity-65 [.dark_&]:hidden"
                  />
                  <Image
                    src={brand.srcDark}
                    alt={brand.alt}
                    width={360}
                    height={80}
                    sizes="128px"
                    className="hidden h-6 w-auto object-contain opacity-55 sm:h-7 sm:opacity-65 [.dark_&]:block"
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
