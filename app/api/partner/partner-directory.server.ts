import { apiRequestPublic } from "~/lib/server/api-client.server";
import type {
  ListPublicPartnersResponse,
  PublicPartnerDetailResponse,
} from "~/types/api-client";

// GET /v1/partner/public — published partners for the public community page.
export async function getPublicPartners(request: Request) {
  return apiRequestPublic<ListPublicPartnersResponse>(
    request,
    "/partner/public",
  );
}

// GET /v1/partner/public/{id} — published partner detail + photos.
export async function getPublicPartner(request: Request, partnerId: string) {
  return apiRequestPublic<PublicPartnerDetailResponse>(
    request,
    `/partner/public/${encodeURIComponent(partnerId)}`,
  );
}
