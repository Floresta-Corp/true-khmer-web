import type { Route } from "./+types/campaign";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { CampaignCtaSection } from "../components/campaign-cta-section";
import { CampaignFaqSection } from "../components/campaign-faq-section";
import { CampaignHeroSection } from "../components/campaign-hero-section";
import { CampaignMessageSection } from "../components/campaign-message-section";

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "Campaign",
    description:
      "A Khmer to Khmer communication campaign — join as a partner or member and help shape Cambodia's future.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "Campaign", path: "/campaign" },
      ]),
    ],
  });
}

export default function CampaignPage() {
  return (
    <div className="overflow-hidden bg-white">
      <CampaignHeroSection />
      <CampaignMessageSection />
      <CampaignFaqSection />
      <CampaignCtaSection />
    </div>
  );
}
