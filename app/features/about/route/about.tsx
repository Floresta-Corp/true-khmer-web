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
    // The document response includes app-layout's SSR'd navbar, which is
    // per-user. A shared cache (Vercel's CDN) keys on URL only, so any
    // `public`/`s-maxage` value here serves one visitor's account to everyone.
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
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
