import type { PartnerRegistrationRequest } from "~/types/api-client";

export type PartnerPackage = NonNullable<PartnerRegistrationRequest["package"]>;
export type CompanyRegistrationData = Pick<
  PartnerRegistrationRequest,
  | "companyName"
  | "companyEmail"
  | "sectorOfActivity"
  | "companyAddress"
  | "city"
  | "country"
  | "companyContactNumber"
> &
  Partial<
    Pick<
      PartnerRegistrationRequest,
      | "registrationNumber"
      | "zipCode"
      | "website"
      | "companyTelegram"
      | "companyFacebookUrl"
      | "companyLinkedinUrl"
      | "package"
    >
  >;
export type PartnerRegistrationPayload = PartnerRegistrationRequest;
