import type { Route } from "../../../+types/root";
import { HeroSection } from "../components/HeroSection";
import { MissionVisionSection } from "../components/MissionVisionSection";
import { EmpowermentSection } from "../components/EmpowermentSection";
import { PillarsSection } from "../components/PillarsSection";
import { TeamSection } from "../components/TeamSection";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "About us",
    description:
      "Why True Khmer exists, what we are building, and the team behind it — a platform for Khmer talent, ventures and initiatives.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "About us", path: "/about" },
      ]),
    ],
  });
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
