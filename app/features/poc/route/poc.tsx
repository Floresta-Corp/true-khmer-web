import type { Route } from "./+types/poc";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { PocBackground } from "../components/poc-background";
import { PocHeroSection } from "../components/poc-hero-section";
import { PocIntroSection } from "../components/poc-intro-section";

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "People of Cambodia",
    description:
      "The people shaping Cambodia, in their own words — stories from across the Kingdom.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "People of Cambodia", path: "/poc" },
      ]),
    ],
  });
}

export default function PeopleOfCambodiaPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <PocBackground />
      <PocHeroSection />
      <PocIntroSection />
    </div>
  );
}
