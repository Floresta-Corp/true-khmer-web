import type {
  ContactPerson,
  CreateManagedPartnerRequest,
  CreateManagedPartnerResponse,
  ListManagedPartnersResponse,
  ManagedPartnerDetailResponse,
  Partner,
  PartnerErrorResponse,
  PartnerPhoto,
  PresignPartnerLogoResponse,
  PresignPartnerPhotoResponse,
  UpdateManagedPartnerRequest,
} from "~/types/api-client";

export type PartnerStatus = Partner["status"];
export type PackageOption = NonNullable<CreateManagedPartnerRequest["package"]>;
export type PartnerAddress = NonNullable<Partner["address"]>;
export type ManagedPartner = Partner;
export type PartnerListMeta = ListManagedPartnersResponse["meta"];
export type CreateManagedPartnerPayload = CreateManagedPartnerRequest;
export type UpdateManagedPartnerPayload = UpdateManagedPartnerRequest;

export type PartnerSortField = "name" | "createdAt";
export type PartnerSortOrder = "asc" | "desc";

export type {
  ContactPerson,
  CreateManagedPartnerResponse,
  ListManagedPartnersResponse,
  ManagedPartnerDetailResponse,
  PartnerErrorResponse,
  PartnerPhoto,
  PresignPartnerLogoResponse,
  PresignPartnerPhotoResponse,
};
