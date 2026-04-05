import {
  getExtendedProjects,
  getMiniProjects,
} from "@/content/portfolio";
import { HomeHero } from "@/components/HomeHero";
import { ExtendedWorkSection } from "@/components/ExtendedWorkSection";
import { MiniWorkSection } from "@/components/MiniWorkSection";
import { InfoSection } from "@/components/InfoSection";
import { ContactBand } from "@/components/ContactBand";

export default function HomePage() {
  const extended = getExtendedProjects();
  const mini = getMiniProjects().slice(0, 2); // Show only first 2 mini projects

  return (
    <>
      <HomeHero />
      <ExtendedWorkSection projects={extended} />
      <MiniWorkSection projects={mini} />
      <InfoSection />
      <ContactBand />
    </>
  );
}
