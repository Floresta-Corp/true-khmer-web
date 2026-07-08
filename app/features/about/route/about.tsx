import type { Route } from "../../../+types/root";
import { HeroSection } from "../components/HeroSection";
import { MissionVisionSection } from "../components/MissionVisionSection";
import { EmpowermentSection } from "../components/EmpowermentSection";
import { PillarsSection } from "../components/PillarsSection";
import { TeamSection } from "../components/TeamSection";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "About Us" },
    {
      name: "description",
      content: "Learn more about our mission and values.",
    },
  ];
}

export function headers(_: Route.HeadersArgs) {
  return {
    "Cache-Control": "s-maxage=1800, stale-while-revalidate=7200",
  };
}

export default function About() {
  return (
    <div className="overflow-hidden bg-white">
      <HeroSection />
      <MissionVisionSection />
      <EmpowermentSection />
      <PillarsSection />
      <TeamSection />
    </div>
  );
}
