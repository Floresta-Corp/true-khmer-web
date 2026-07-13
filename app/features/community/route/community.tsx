import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { CommunityHero } from "../components/community-hero";
import { CommunityInfoSection } from "../components/community-info-section";
import { HowToJoinSection } from "../components/how-to-join-section";
import {
  PartnerCard,
  type PartnerCardVariant,
} from "../components/partner-card";
import { PartnerCardGrid } from "../components/partner-card-grid";
import { PartnerCardSkeleton } from "../components/partner-card-skeleton";
import {
  communityLoader,
  type PartnersByTier,
} from "../services/community.loader";

export const loader = communityLoader;

export function meta() {
  return [
    { title: "Community | True Khmer" },
    { name: "description", content: "Welcome to True Khmer Community!" },
  ];
}

const TIER_SECTIONS: Array<{
  key: keyof PartnersByTier;
  title: string;
  variant: PartnerCardVariant;
}> = [
  { key: "government", title: "Supporter", variant: 5 },
  { key: "platinum", title: "Platinum Partners", variant: 1 },
  { key: "gold", title: "Gold Partners", variant: 1 },
  { key: "silver", title: "Silver Partners", variant: 2 },
  { key: "bronze", title: "Bronze Partners", variant: 3 },
  { key: "smeVideo", title: "SME & Video Partners", variant: 4 },
];

export default function Community() {
  const { partnersByTier } = useLoaderData<typeof communityLoader>();

  return (
    <>
      <CommunityHero />
      <CommunityInfoSection />
      <HowToJoinSection />

      <div className="mx-auto mt-30 mb-20 max-w-7xl space-y-6 px-4 sm:px-6 md:mt-40">
        {TIER_SECTIONS.map((section) => (
          <Suspense key={section.key} fallback={<PartnerCardSkeleton />}>
            <Await resolve={partnersByTier}>
              {(resolved) => {
                const partners = resolved?.[section.key];
                if (!partners || partners.length === 0) return null;

                return (
                  <>
                    <div className="mt-10 mb-6 flex justify-between first:mt-0">
                      <h2 className="mb-3 text-left text-3xl font-bold text-[#243d95] sm:text-4xl dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                    <div className="my-5 w-full md:my-10">
                      <PartnerCardGrid variant={section.variant}>
                        {partners.map((partner) => (
                          <PartnerCard
                            key={partner.id}
                            partner={partner}
                            variant={section.variant}
                          />
                        ))}
                      </PartnerCardGrid>
                    </div>
                  </>
                );
              }}
            </Await>
          </Suspense>
        ))}
      </div>
    </>
  );
}
