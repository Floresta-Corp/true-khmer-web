import type { Route as EditProfileRoute } from "project-types/myspace/routes/+types/edit-profile";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getUserId } from "~/lib/server/session.server";
import { GetMyspaceMe, UpdateMyspace } from "~/services/myspace/server/me.server";
import type { Profile } from "~/services/myspace/types";
import type { UpdateMySpaceInput } from "~/services/myspace/types";
import { ProtectedApiError } from "~/lib/server/api-client.server";

interface EditProfileLoaderData {
  me: Profile | null;
  userId: string | null;
}

export async function EditProfileLoader({
  request,
}: EditProfileRoute.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);
  const meResult = await GetMyspaceMe(request);

  return {
    userId,
    me: meResult.data.profile,
  } satisfies EditProfileLoaderData;
}

export async function EditProfileAction({
  request,
}: EditProfileRoute.ActionArgs) {
  await requireAuthenticatedUser(request);

  const formData = await request.formData();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim() || null;
  const occupation = String(formData.get("occupation") ?? "").trim() || null;
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim() || null;
  const telegramUsername =
    String(formData.get("telegramUsername") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const countryId = String(formData.get("countryId") ?? "").trim() || null;
  const cityId = String(formData.get("cityId") ?? "").trim() || null;
  const avatarKey = String(formData.get("avatarKey") ?? "").trim() || null;
  const skillsRaw = String(formData.get("skills") ?? "").trim();
  const skills = skillsRaw ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

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

  const payload: UpdateMySpaceInput = {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    occupation,
    phoneNumber,
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

  try {
    const result = await UpdateMyspace(request, payload);
    return result;
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return {
        ok: false,
        message: error.message || "Failed to update profile.",
      };
    }
    return {
      ok: false,
      message: "Failed to update profile.",
    };
  }
}