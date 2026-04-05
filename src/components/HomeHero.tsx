import { site } from "@/content/portfolio";
import { HeroArt } from "@/components/HeroArt";
import { Reveal } from "@/components/Reveal";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-[94svh] flex-col justify-end overflow-hidden border-b border-[var(--line)] pb-20 pt-32 sm:min-h-[92svh] sm:pb-28 sm:pt-40"
      aria-labelledby="hero-heading"
    >
      <HeroArt />
      <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-12">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--faint)]">
            {site.title} · {site.yearsExperience}
          </p>
        </Reveal>

        <AnimatedHeadline
          id="hero-heading"
          text={site.heroLead}
          initialDelay={0.1}
          className="mt-5 max-w-[18ch] text-balance font-bold leading-[1.0] tracking-[-0.04em] text-[var(--text)] sm:max-w-[22ch]"
          style={{
            fontFamily: '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
            fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
          }}
        />

        <Reveal delay={0.3}>
          <div className="mt-10 h-px w-12 bg-[var(--cta)]" aria-hidden />
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mt-6 max-w-[38rem] text-pretty text-lg leading-[1.6] text-[var(--muted)] sm:text-xl">
            {site.heroSupporting}
          </p>
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--faint)]">
            {site.heroRibbon}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
