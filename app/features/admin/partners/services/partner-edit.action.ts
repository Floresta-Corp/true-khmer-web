import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/partners/route/+types/partners.$partnerId.edit";

import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import {
  addManagedPartnerPhoto,
  deleteManagedPartner,
  deleteManagedPartnerPhoto,
  updateManagedPartner,
} from "~/api/admin/partners/partners.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import type {
  CreateManagedPartnerRequest,
  Partner,
  UpdateManagedPartnerRequest,
} from "~/types/api-client";

type PackageOption = NonNullable<CreateManagedPartnerRequest["package"]>;
type PartnerAddress = NonNullable<Partner["address"]>;

const RESTRICTED_MESSAGE = "Partner management is restricted to Super Admins.";

function optional(value: FormDataEntryValue | null) {
  const str = (value as string) ?? "";
  return str.trim() ? str : null;
}

function textValue(formData: FormData, field: string) {
  return ((formData.get(field) as string | null) ?? "").trim();
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validatePartnerEdit(formData: FormData) {
  const errors: Record<string, string> = {};
  const requiredFields = [
    ["name", "Partner name is required"],
    ["email", "Email is required"],
    ["phoneNumber", "Phone number is required"],
    ["sectorActivity", "Sector of activity is required"],
    ["country", "Country is required"],
    ["city", "City is required"],
  ] as const;

  for (const [field, message] of requiredFields) {
    if (!textValue(formData, field)) {
      errors[field] = message;
    }
  }

  const name = textValue(formData, "name");
  if (name && name.length < 2) {
    errors.name = "Partner name must be at least 2 characters";
  }

  const email = textValue(formData, "email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  const phoneNumber = textValue(formData, "phoneNumber");
  if (phoneNumber && !/^\+?[0-9\s\-()]+$/.test(phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number";
  } else if (phoneNumber && (phoneNumber.length < 5 || phoneNumber.length > 30)) {
    errors.phoneNumber = "Phone number must be 5 to 30 characters";
  }

  const urlFields = [
    ["website", "Website"],
    ["facebook", "Facebook URL"],
    ["linkedin", "LinkedIn URL"],
  ] as const;
  for (const [field, label] of urlFields) {
    const value = textValue(formData, field);
    if (value && !isValidUrl(value)) {
      errors[field] = `${label} must be a valid URL`;
    }
  }

  const maxLengthFields = [
    ["nameKh", "Partner name Khmer", 150],
    ["registrationNumber", "Registration number", 100],
    ["sectorActivityKm", "Sector of activity Khmer", 100],
    ["address", "Address", 200],
    ["addressKm", "Address Khmer", 200],
    ["country", "Country", 100],
    ["countryKm", "Country Khmer", 100],
    ["city", "City", 100],
    ["cityKm", "City Khmer", 100],
    ["zipCode", "ZIP code", 20],
    ["zipCodeKm", "ZIP code Khmer", 20],
    ["telegram", "Telegram", 100],
    ["bio", "Bio", 125],
    ["bioKm", "Bio Khmer", 125],
    ["description", "Description", 5000],
    ["descriptionKm", "Description Khmer", 5000],
  ] as const;

  for (const [field, label, maxLength] of maxLengthFields) {
    const value = textValue(formData, field);
    if (value.length > maxLength) {
      errors[field] = `${label} must be ${maxLength} characters or less`;
    }
  }

  return errors;
}

export async function partnerEditAction({
  request,
  params,
}: Route.ActionArgs) {
  await requireSuperAdmin(request, RESTRICTED_MESSAGE);

  const partnerId = params.partnerId;
  if (!partnerId) {
    throw new Response("Partner ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const action = formData.get("action");

  try {
    if (action === "delete") {
      const result = await deleteManagedPartner(request, partnerId);
      return redirect("/tk-admin/partners", {
        ...(result.setCookie
          ? { headers: { "Set-Cookie": result.setCookie } }
          : {}),
      });
    }

    if (action === "addPhoto") {
      const url = formData.get("photoUrl") as string;
      if (!url) {
        return data({ error: "Photo URL is required" });
      }
      const result = await addManagedPartnerPhoto(request, partnerId, url);
      return data(
        { success: true, message: "Photo added successfully", type: "photoAdd" },
        {
          ...(result.setCookie
            ? { headers: { "Set-Cookie": result.setCookie } }
            : {}),
        },
      );
    }

    if (action === "deletePhoto") {
      const photoId = formData.get("photoId") as string;
      if (!photoId) {
        return data({ error: "Photo ID is required" });
      }
      const result = await deleteManagedPartnerPhoto(
        request,
        partnerId,
        photoId,
      );
      return data(
        {
          success: true,
          message: "Photo deleted successfully",
          type: "photoDelete",
        },
        {
          ...(result.setCookie
            ? { headers: { "Set-Cookie": result.setCookie } }
            : {}),
        },
      );
    }

    if (action === "save") {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phoneNumber = formData.get("phoneNumber") as string;
      const sectorActivity = formData.get("sectorActivity") as string;
      const bio = optional(formData.get("bio"));
      const bioKm = optional(formData.get("bioKm"));

      const validationErrors = validatePartnerEdit(formData);
      if (Object.keys(validationErrors).length > 0) {
        return data({
          error: "Please check your form inputs.",
          validationErrors,
        });
      }

      const status = formData.get("status") as "ACTIVE" | "INACTIVE";
      const isPublished =
        status === "INACTIVE" ? false : formData.get("isPublished") === "true";

      const address: PartnerAddress = {
        street: optional(formData.get("address")),
        city: optional(formData.get("city")),
        zipCode: optional(formData.get("zipCode")),
        country: optional(formData.get("country")),
      };
      const hasAddress = Object.values(address).some(Boolean);
      const addressKm: PartnerAddress = {
        street: optional(formData.get("addressKm")),
        city: optional(formData.get("cityKm")),
        zipCode: optional(formData.get("zipCodeKm")),
        country: optional(formData.get("countryKm")),
      };
      const hasAddressKm = Object.values(addressKm).some(Boolean);

      const payload: UpdateManagedPartnerRequest = {
        name,
        nameKh: optional(formData.get("nameKh")),
        email,
        phoneNumber,
        registrationNumber: optional(formData.get("registrationNumber")),
        sectorActivity,
        sectorActivityKm: optional(formData.get("sectorActivityKm")),
        website: optional(formData.get("website")),
        bio,
        bioKm,
        description: optional(formData.get("description")),
        descriptionKm: optional(formData.get("descriptionKm")),
        status,
        isPublished,
        facebook: optional(formData.get("facebook")),
        linkedin: optional(formData.get("linkedin")),
        telegram: optional(formData.get("telegram")),
        logo: optional(formData.get("logo")),
        package: (formData.get("package") as PackageOption) || null,
        packageKm: (formData.get("packageKm") as UpdateManagedPartnerRequest["packageKm"]) || null,
        address: hasAddress ? address : null,
        addressKm: hasAddressKm ? addressKm : null,
      };

      const result = await updateManagedPartner(request, partnerId, payload);
      return redirect(`/tk-admin/partners/${partnerId}`, {
        ...(result.setCookie
          ? { headers: { "Set-Cookie": result.setCookie } }
          : {}),
      });
    }
  } catch (error) {
    console.error("Error processing partner edit action:", error);
    if (error instanceof ProtectedApiError) {
      const details = error.details as
        | { validationErrors?: Record<string, string> }
        | undefined;
      return data({
        error: error.message || "Failed to update partner. Please try again.",
        validationErrors: details?.validationErrors ?? null,
      });
    }
    return data({
      error: "Failed to update partner. Please try again.",
      validationErrors: null,
    });
  }

  return data({ error: "Invalid action" });
}
