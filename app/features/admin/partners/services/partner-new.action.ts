import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/partners/route/+types/partners.new";

import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { createManagedPartner } from "~/api/admin/partners/partners.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import type { CreateManagedPartnerRequest } from "~/types/api-client";

const RESTRICTED_MESSAGE = "Partner management is restricted to Super Admins.";

const REQUIRED_FIELDS: Array<keyof CreateManagedPartnerRequest> = [
  "companyName",
  "companyEmail",
  "companyContactNumber",
  "sectorOfActivity",
  "companyAddress",
  "city",
  "country",
  "package",
  "firstName",
  "lastName",
  "userEmail",
  "position",
  "userContactNumber",
];

const URL_FIELDS = [
  "website",
  "companyFacebookUrl",
  "companyLinkedinUrl",
  "userFacebookUrl",
  "userLinkedinUrl",
] as const;

const EMAIL_FIELDS = ["companyEmail", "userEmail"] as const;

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validatePartnerCreate(raw: Record<string, string>) {
  const errors: Record<string, string> = {};

  for (const field of REQUIRED_FIELDS) {
    if (!raw[field]?.trim()) {
      errors[field] = "This field is required";
    }
  }

  if (raw.companyName?.trim() && raw.companyName.trim().length < 2) {
    errors.companyName = "Company name must be at least 2 characters";
  }
  if (raw.companyAddress?.trim() && raw.companyAddress.trim().length < 5) {
    errors.companyAddress = "Company address must be at least 5 characters";
  }
  if (raw.city?.trim() && raw.city.trim().length < 2) {
    errors.city = "City must be at least 2 characters";
  }
  if (raw.country?.trim() && raw.country.trim().length < 2) {
    errors.country = "Country must be at least 2 characters";
  }
  if (raw.firstName?.trim() && raw.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }
  if (raw.lastName?.trim() && raw.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }
  if (raw.position?.trim() && raw.position.trim().length < 2) {
    errors.position = "Position is required";
  }

  for (const field of EMAIL_FIELDS) {
    if (raw[field]?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw[field])) {
      errors[field] = "Please enter a valid email address";
    }
  }

  for (const field of URL_FIELDS) {
    if (raw[field]?.trim() && !isValidUrl(raw[field])) {
      errors[field] = "Please enter a valid URL";
    }
  }

  for (const field of ["companyContactNumber", "userContactNumber"] as const) {
    const value = raw[field]?.trim();
    if (value && !/^\+?[0-9\s\-()]+$/.test(value)) {
      errors[field] = "Please enter a valid phone number";
    } else if (value && (value.length < 5 || value.length > 30)) {
      errors[field] = "Phone number must be 5 to 30 characters";
    }
  }

  if (raw.zipCode?.trim() && raw.zipCode.length > 20) {
    errors.zipCode = "ZIP code must be 20 characters or less";
  }
  if (raw.registrationNumber?.trim() && raw.registrationNumber.length > 100) {
    errors.registrationNumber = "Registration number must be 100 characters or less";
  }
  if (raw.userIdentity?.trim() && raw.userIdentity.length > 50) {
    errors.userIdentity = "ID / Passport number must be 50 characters or less";
  }
  if (raw.bio?.trim() && raw.bio.length > 300) {
    errors.bio = "Company bio must be 300 characters or less";
  }
  if (raw.description?.trim() && raw.description.length > 5000) {
    errors.description = "Company description must be 5000 characters or less";
  }

  return errors;
}

export async function partnerNewAction({ request }: Route.ActionArgs) {
  await requireSuperAdmin(request, RESTRICTED_MESSAGE);

  const formData = await request.formData();
  const raw = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >;

  const validationErrors = validatePartnerCreate(raw);
  if (Object.keys(validationErrors).length > 0) {
    return data({
      success: false,
      error: "Please check your form inputs.",
      validationErrors,
    });
  }

  const payload: CreateManagedPartnerRequest = {
    companyName: raw.companyName,
    registrationNumber: raw.registrationNumber || undefined,
    companyEmail: raw.companyEmail,
    companyContactNumber: raw.companyContactNumber,
    sectorOfActivity: raw.sectorOfActivity,
    companyAddress: raw.companyAddress,
    city: raw.city,
    zipCode: raw.zipCode || undefined,
    country: raw.country,
    website: raw.website || undefined,
    companyFacebookUrl: raw.companyFacebookUrl || undefined,
    companyLinkedinUrl: raw.companyLinkedinUrl || undefined,
    companyTelegram: raw.companyTelegram || undefined,
    package: (raw.package as CreateManagedPartnerRequest["package"]) || undefined,
    bio: raw.bio || undefined,
    description: raw.description || undefined,

    firstName: raw.firstName,
    lastName: raw.lastName,
    userEmail: raw.userEmail,
    userIdentity: raw.userIdentity || undefined,
    position: raw.position,
    userContactNumber: raw.userContactNumber,
    userFacebookUrl: raw.userFacebookUrl || undefined,
    userLinkedinUrl: raw.userLinkedinUrl || undefined,
    userTelegram: raw.userTelegram || undefined,
  };

  try {
    const result = await createManagedPartner(request, payload);
    return redirect(`/tk-admin/partners/${result.data.partnerId}`, {
      ...(result.setCookie
        ? { headers: { "Set-Cookie": result.setCookie } }
        : {}),
    });
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      const details = error.details as
        | { validationErrors?: Record<string, string> }
        | undefined;
      return data({
        success: false,
        error: error.message || "Please check your form inputs.",
        validationErrors: details?.validationErrors ?? null,
      });
    }

    return data({
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      validationErrors: null,
    });
  }
}
