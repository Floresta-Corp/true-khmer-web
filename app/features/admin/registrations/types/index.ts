import type {
  ContactPerson,
  ListPendingPartnersResponse,
  Partner,
  PartnerDetailResponse,
  PartnerStatusResponse,
} from "~/types/api-client";

export type PartnerRegistrationStatus = Partner["status"];
export type PartnerAddress = NonNullable<Partner["address"]>;
export type PartnerRegistration = Partner;
export type PartnerRegistrationAction = "ACTIVE" | "DELETE";
export type UpdatePartnerRegistrationStatusResponse = PartnerStatusResponse;

export type {
  ContactPerson,
  ListPendingPartnersResponse,
  PartnerDetailResponse,
};
