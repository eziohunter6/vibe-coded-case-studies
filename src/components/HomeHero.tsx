"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/portfolio";
import { HeroArt } from "@/components/HeroArt";
import { HeroVideo } from "@/components/HeroVideo";
import { Reveal } from "@/components/Reveal";
import { ParallaxHeadline } from "@/components/ParallaxHeadline";

const HELVETICA = '"Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif';
const GHOST_TEXT = `${site.heroSupporting[0]} ${site.heroSupporting[1]}`;

export function HomeHero() {
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden border-b border-[var(--line)] pb-[72px] pt-24 sm:pt-40"
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

        {/* Headline with mouse parallax + ghost text on hover */}
        <div
          className="relative mt-5"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.div
            animate={{ opacity: hovered && !prefersReduced ? 0.12 : 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ParallaxHeadline
              id="hero-heading"
              text={site.heroLead}
              delay={0.1}
              className="max-w-[20ch] text-balance font-bold leading-[1.05] tracking-[-0.04em] text-[var(--text)] sm:max-w-[24ch]"
              style={{
                fontFamily: HELVETICA,
                fontSize: "clamp(1.92rem, 4.4vw, 4rem)",
              }}
            />
          </motion.div>

          {/* Ghost text layer */}
          <AnimatePresence>
            {hovered && !prefersReduced && (
              <motion.p
                key="ghost"
                initial={{ opacity: 0, filter: "blur(10px)", y: 6 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -4 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute inset-0 max-w-[20ch] text-balance font-bold leading-[1.05] tracking-[-0.04em] text-[var(--text)] sm:max-w-[24ch]"
                style={{
                  fontFamily: HELVETICA,
                  fontSize: "clamp(1.92rem, 4.4vw, 4rem)",
                }}
                aria-hidden
              >
                {GHOST_TEXT}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

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
