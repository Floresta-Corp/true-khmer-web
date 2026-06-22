import type { Route as EditProfileRoute } from "project-types/myspace/routes/+types/edit-profile";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { commitSession, getSession } from "~/lib/server/session.server";
import { invalidateAuthSessionCacheForRequest } from "~/services/auth/session.server";
import { UpdateMyspace } from "~/services/myspace/server/me.server";
import type { Profile, UpdateMySpaceInput } from "~/services/myspace/types";
import { UploadAvatarPresign } from "~/services/uploads-avatar-presign.server";

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function displayNameForProfile(profile: Profile) {
  const displayName = profile.user.displayName?.trim();
  if (displayName) return displayName;

  return [profile.user.firstName, profile.user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

async function syncUpdatedProfileToSession(request: Request, profile: Profile) {
  const session = await getSession(request);
  const currentUser = readRecord(session.get("user"));
  const currentProfile = readRecord(currentUser.profile);
  const displayName = displayNameForProfile(profile);
  const avatarKey = profile.profile.avatarKey ?? "";

  const nextUser = {
    ...currentUser,
    id: profile.user.id,
    email: profile.user.email,
    firstName: profile.user.firstName,
    lastName: profile.user.lastName,
    name: displayName || profile.user.email,
    gender: profile.user.gender,
    occupation: profile.user.occupation,
    phone: profile.user.phone,
    avatarKey,
    profile: {
      ...currentProfile,
      displayName: displayName || profile.user.email,
      avatarKey,
    },
  };

  session.set("user", nextUser);
  session.set("userId", profile.user.id);
  session.set("email", profile.user.email);
  session.set("name", nextUser.name);

  return commitSession(session);
}

export async function EditProfileAction({
  request,
}: EditProfileRoute.ActionArgs) {
  const auth = await requireUser(request);
  let presignCookie: string | undefined;
  let sessionCookie: string | undefined;
  const respond = <T>(payload: T) =>
    withAuthData(
      {
        setCookie: [auth.setCookie, presignCookie, sessionCookie].flatMap(
          (cookie) => (Array.isArray(cookie) ? cookie : cookie ? [cookie] : []),
        ),
      },
      payload,
    );

  const formData = await request.formData();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim() || null;
  const occupation = String(formData.get("occupation") ?? "").trim() || null;
  const hasPhoneInput =
    formData.has("phone.country") || formData.has("phone.nationalNumber");
  const phoneCountry = String(formData.get("phone.country") ?? "").trim();
  const phoneNationalNumber = String(
    formData.get("phone.nationalNumber") ?? "",
  ).trim();
  const telegramUsername =
    String(formData.get("telegramUsername") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const countryId = String(formData.get("countryId") ?? "").trim() || null;
  const cityId = String(formData.get("cityId") ?? "").trim() || null;
  const avatarKey = String(formData.get("avatarKey") ?? "").trim() || null;
  const skillsRaw = String(formData.get("skills") ?? "").trim();
  const skills = skillsRaw
    ? skillsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const website = String(formData.get("website") ?? "").trim() || null;
  const linkedin = String(formData.get("linkedin") ?? "").trim() || null;
  const twitter = String(formData.get("twitter") ?? "").trim() || null;
  const facebook = String(formData.get("facebook") ?? "").trim() || null;

  const profileVisibility =
    String(formData.get("profileVisibility") ?? "").trim() || "public";
  const contactVisibility =
    String(formData.get("contactVisibility") ?? "").trim() || "public";
  const socialLinksVisibility =
    String(formData.get("socialLinksVisibility") ?? "").trim() || "public";
  const contributionsVisibility =
    String(formData.get("contributionsVisibility") ?? "").trim() || "public";

  let payload: UpdateMySpaceInput = {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    occupation,
    ...(hasPhoneInput
      ? {
          phone: phoneNationalNumber
            ? {
                country: phoneCountry,
                nationalNumber: phoneNationalNumber,
              }
            : null,
        }
      : {}),
    telegramUsername,
    bio,
    countryId,
    cityId,
    avatarKey,
    skills,
    socialLinks: {
      website,
      linkedin,
      twitter,
      facebook,
    },
    visibility: {
      profile: profileVisibility,
      contact: contactVisibility,
      socialLinks: socialLinksVisibility,
      contributions: contributionsVisibility,
    },
  };

  const avatarFile = formData.get("avatarFile") as File;
  if (avatarFile) {
    try {
      const result = await UploadAvatarPresign(request, {
        contentType: avatarFile.type,
        fileSize: avatarFile.size,
      });
      if (result.setCookie) presignCookie = result.setCookie;
      if (!result.data.ok) {
        return respond({
          ok: false,
          message: "Failed to prepare avatar upload.",
        });
      }
      const upload = result.data.upload;
      const uploadResult = await fetch(upload.uploadUrl, {
        method: upload.method,
        body: avatarFile,
        headers: upload.requiredHeaders,
        signal: AbortSignal.timeout(30_000),
      });
      if (!uploadResult.ok) {
        console.error("avatar upload failed", {
          status: uploadResult.status,
          url: upload.uploadUrl,
        });
        return respond({
          ok: false,
          message: "Failed to upload avatar image.",
        });
      }
      payload = { ...payload, avatarKey: upload.avatarKey };
    } catch (err) {
      console.error("Avatar upload failed", err);
      return respond({
        ok: false,
        message: "Failed to upload avatar image.",
      });
    }
  }
  try {
    const result = await UpdateMyspace(request, payload);
    await invalidateAuthSessionCacheForRequest(request);

    if (result.setCookie) {
      sessionCookie = result.setCookie;
    } else {
      sessionCookie = await syncUpdatedProfileToSession(
        request,
        result.data.profile,
      );
    }

    return respond(result.data);
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return respond({
        ok: false,
        message: error.message || "Failed to update profile.",
      });
    }
    console.error("Failed to update profile", error);
    return respond({
      ok: false,
      message: "Failed to update profile.",
    });
  }
}
