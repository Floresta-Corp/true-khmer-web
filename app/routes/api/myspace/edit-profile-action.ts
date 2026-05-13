import type { Route as EditProfileRoute } from "project-types/myspace/routes/+types/edit-profile";
import { resourceLimits } from "worker_threads";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { UpdateMyspace } from "~/services/myspace/server/me.server";
import type { UpdateMySpaceInput } from "~/services/myspace/types";
import { UploadAvatarPresign } from "~/services/uploads-avatar-presign.server";

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

  console.log({ payload });

  const avatarFile = formData.get("avatarFile") as File;

  console.log({ avatarFile });
  if (avatarFile) {
    try {
      const result = await UploadAvatarPresign(request, {
        contentType: avatarFile.type,
        fileName: avatarFile.name,
        fileSize: avatarFile.size,
      });
      if (result.data.ok) {
        const upload = result.data.upload;
        console.log({ upload });
        try {
          const uploadResult = await fetch(upload.uploadUrl, {
            method: upload.method,
            body: avatarFile,
            headers: upload.requiredHeaders,
          });
          if (uploadResult.ok && uploadResult.status === 200) {
            payload = {
              ...payload,
              avatarKey: upload.avatarKey,
            };
          }
        } catch (err) {
          console.error("upload to R2 Error");
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  console.log({ payload });
  try {
    const result = await UpdateMyspace(request, payload);
    return result.data;
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
      error: error,
    };
  }
}
