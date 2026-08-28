import type { Route } from "project-types/community/route/+types/community";
import { isResourceUnavailable } from "~/lib/server/api-client.server";
import { data } from "react-router";
import { getPublicPartners } from "~/api/partner/partner-directory.server";
import type { PublicPartner } from "~/types/api-client";

export interface PartnersByTier {
  government: PublicPartner[];
  platinum: PublicPartner[];
  gold: PublicPartner[];
  silver: PublicPartner[];
  bronze: PublicPartner[];
  smeVideo: PublicPartner[];
}

function bucketPartnersByTier(partners: PublicPartner[]): PartnersByTier {
  return {
    government: partners.filter((partner) => partner.package === "Government"),
    platinum: partners.filter((partner) => partner.package === "Platinum"),
    gold: partners.filter((partner) => partner.package === "Gold"),
    silver: partners.filter((partner) => partner.package === "Silver"),
    bronze: partners.filter((partner) => partner.package === "Bronze"),
    smeVideo: partners.filter(
      (partner) => partner.package === "SME" || partner.package === "Video",
    ),
  };
}

// Streamed like the admin partners list: the promise is handed to the route
// unresolved and rendered via <Suspense>/<Await> per tier section.
export async function communityLoader({ request }: Route.LoaderArgs) {
  const partnersByTier = getPublicPartners(request)
    .then((result) => bucketPartnersByTier(result.data.data))
    .catch((error) => {
      if (isResourceUnavailable(error, "community partners")) return null;
      throw error;
    });

  return data({ partnersByTier });
}
