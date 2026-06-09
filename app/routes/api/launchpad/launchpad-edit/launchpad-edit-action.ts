import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  errorActionResponse,
  successActionResponse,
  transformActionResponse,
} from "~/lib/server/action-response.server";
import {
  updateLaunchpad,
  uploadLaunchpadCoverPresign,
  uploadLaunchpadDocumentPresign,
  uploadLaunchpadLogoPresign,
} from "~/services/launchpad/server/launchpad.opportunities.server";
import {
  LaunchpadUpdateInputSchema,
  type LaunchpadPresignedUpload,
} from "~/services/launchpad/types/create";

type UnknownRecord = Record<string, unknown>;

type LaunchpadEditActionResponse =
  | { success: true; redirectTo: string }
  | { error: string; fieldErrors?: Record<string, string> };

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function readStringFromKeys(source: unknown, keys: string[]): string | null {
  if (!isRecord(source)) return null;
  for (const key of keys) {
    const value = readString(source[key]);
    if (value) return value;
  }
  return null;
}

function readHeaders(source: unknown): Record<string, string> | undefined {
  if (!isRecord(source)) return undefined;

  const headersLike =
    source.requiredHeaders ?? source.required_headers ?? source.headers;

  if (!isRecord(headersLike)) return undefined;

  const parsed: Record<string, string> = {};
  for (const [key, value] of Object.entries(headersLike)) {
    if (typeof value === "string") {
      parsed[key] = value;
    }
  }

  return Object.keys(parsed).length > 0 ? parsed : undefined;
}

function resolvePresignedUpload(
  payload: unknown,
): LaunchpadPresignedUpload | null {
  const candidates: unknown[] = [
    payload,
    isRecord(payload) ? payload.upload : undefined,
    isRecord(payload) && isRecord(payload.data)
      ? payload.data.upload
      : undefined,
    isRecord(payload) && isRecord(payload.result)
      ? (payload.result as UnknownRecord).upload
      : undefined,
    isRecord(payload) ? payload.presignedUpload : undefined,
    isRecord(payload) && isRecord(payload.data)
      ? (payload.data as UnknownRecord).presignedUpload
      : undefined,
  ];

  for (const candidate of candidates) {
    if (!isRecord(candidate)) continue;

    const uploadUrl = readStringFromKeys(candidate, [
      "uploadUrl",
      "upload_url",
      "signedUrl",
      "signed_url",
      "url",
    ]);

    if (!uploadUrl) continue;

    const method =
      readStringFromKeys(candidate, ["method", "httpMethod", "http_method"]) ??
      "PUT";

    return {
      ...(candidate as LaunchpadPresignedUpload),
      uploadUrl,
      method,
      requiredHeaders: readHeaders(candidate),
      logoKey:
        readStringFromKeys(candidate, ["logoKey", "logo_key"]) ?? undefined,
      coverKey:
        readStringFromKeys(candidate, ["coverKey", "cover_key"]) ?? undefined,
      documentKey:
        readStringFromKeys(candidate, ["documentKey", "document_key"]) ??
        undefined,
      materialDocumentKey:
        readStringFromKeys(candidate, [
          "materialDocumentKey",
          "material_document_key",
        ]) ?? undefined,
      fileKey:
        readStringFromKeys(candidate, ["fileKey", "file_key"]) ?? undefined,
      key: readStringFromKeys(candidate, ["key"]) ?? undefined,
    };
  }

  return null;
}

function findUploadKeyDeep(value: unknown, depth = 0): string | null {
  if (depth > 4 || !isRecord(value)) return null;

  const direct = readStringFromKeys(value, [
    "logoKey",
    "logo_key",
    "coverKey",
    "cover_key",
    "materialDocumentKey",
    "material_document_key",
    "documentKey",
    "document_key",
    "fileKey",
    "file_key",
    "objectKey",
    "object_key",
    "logoImageKey",
    "logo_image_key",
    "coverImageKey",
    "cover_image_key",
    "documentFileKey",
    "document_file_key",
    "storageKey",
    "storage_key",
    "path",
    "filePath",
    "file_path",
    "key",
  ]);

  if (direct) return direct;

  for (const nested of Object.values(value)) {
    if (isRecord(nested)) {
      const found = findUploadKeyDeep(nested, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

function toUploadFile(value: FormDataEntryValue | null): File | null {
  if (value instanceof File && value.size > 0) {
    return value;
  }
  return null;
}

function getUploadKey(upload: unknown): string | null {
  return findUploadKeyDeep(upload);
}

async function uploadToStorage(upload: LaunchpadPresignedUpload, file: File) {
  const headers = new Headers(upload.requiredHeaders ?? {});

  if (!headers.has("Content-Type") && file.type) {
    headers.set("Content-Type", file.type);
  }

  if (!headers.has("Content-Length")) {
    headers.set("Content-Length", String(file.size));
  }

  const response = await fetch(upload.uploadUrl, {
    method: upload.method || "PUT",
    headers,
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
}

function toLaunchpadEditActionResponse(
  result:
    | ReturnType<typeof successActionResponse>
    | ReturnType<typeof errorActionResponse>,
): LaunchpadEditActionResponse {
  if (result.ok) {
    return {
      success: true,
      redirectTo: (result.data as { redirectTo: string }).redirectTo,
    };
  }

  return {
    error: result.error ?? "Failed to update launchpad. Please try again.",
  };
}

function parseValidationFieldErrors(
  details: unknown,
): Record<string, string> | null {
  if (!isRecord(details) || !isRecord(details.error)) {
    return null;
  }

  const message = details.error.message;
  if (typeof message !== "string") {
    return null;
  }

  try {
    const parsedIssues = JSON.parse(message);
    if (!Array.isArray(parsedIssues)) {
      return null;
    }

    const entries = parsedIssues
      .map((issue) => {
        if (!isRecord(issue) || typeof issue.message !== "string") {
          return null;
        }

        const issuePath = issue.path;
        if (Array.isArray(issuePath) && typeof issuePath[0] === "string") {
          return [issuePath[0], issue.message] as const;
        }

        if (typeof issuePath === "string") {
          return [issuePath, issue.message] as const;
        }

        return null;
      })
      .filter((entry): entry is readonly [string, string] => entry !== null);

    if (entries.length === 0) {
      return null;
    }

    return Object.fromEntries(entries);
  } catch {
    return null;
  }
}

export async function launchpadEditAction({
  request,
  params,
}: ActionFunctionArgs) {
  const id = params.id;
  if (!id) {
    return toLaunchpadEditActionResponse(
      errorActionResponse("Missing launchpad id"),
    );
  }

  const auth = await requireUser(request);
  const respond = (payload: LaunchpadEditActionResponse) =>
    withAuthData(auth, payload);

  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType !== "update-launchpad") {
    return respond(
      toLaunchpadEditActionResponse(
        errorActionResponse("Invalid action type"),
      ),
    );
  }

  const dataStr = formData.get("data");
  if (!dataStr || typeof dataStr !== "string") {
    return respond(
      toLaunchpadEditActionResponse(
        errorActionResponse("Invalid launchpad form data"),
      ),
    );
  }

  try {
    const parsedData = JSON.parse(dataStr);

    const logoFile = toUploadFile(formData.get("logoFile"));
    const coverFile = toUploadFile(formData.get("coverFile"));
    const documentFiles = formData
      .getAll("documentFiles")
      .map((entry) => toUploadFile(entry))
      .filter((value): value is File => value instanceof File);

    let logoKey = parsedData.logoKey ?? "";
    let coverKey = parsedData.coverKey ?? "";

    if (logoFile) {
      const logoRes = await uploadLaunchpadLogoPresign(request, {
        contentType: logoFile.type,
        fileSize: logoFile.size,
      });

      const logoPresign = resolvePresignedUpload(logoRes.data);
      if (!logoPresign) {
        return respond(
          toLaunchpadEditActionResponse(
            errorActionResponse("Unable to get logo upload payload"),
          ),
        );
      }

      const newLogoKey = getUploadKey(logoPresign) ?? getUploadKey(logoRes.data);
      if (!newLogoKey) {
        return respond(
          toLaunchpadEditActionResponse(
            errorActionResponse("Unable to get logo upload key"),
          ),
        );
      }

      await uploadToStorage(logoPresign, logoFile);
      logoKey = newLogoKey;
    }

    if (coverFile) {
      const coverRes = await uploadLaunchpadCoverPresign(request, {
        contentType: coverFile.type,
        fileSize: coverFile.size,
      });

      const coverPresign = resolvePresignedUpload(coverRes.data);
      if (!coverPresign) {
        return respond(
          toLaunchpadEditActionResponse(
            errorActionResponse("Unable to get cover upload payload"),
          ),
        );
      }

      const newCoverKey =
        getUploadKey(coverPresign) ?? getUploadKey(coverRes.data);
      if (!newCoverKey) {
        return respond(
          toLaunchpadEditActionResponse(
            errorActionResponse("Unable to get cover upload key"),
          ),
        );
      }

      await uploadToStorage(coverPresign, coverFile);
      coverKey = newCoverKey;
    }

    let materialDocumentKey: string[] = parsedData.materialDocumentKey ?? [];
    let materialDocumentName: string[] = parsedData.materialDocumentName ?? [];

    if (documentFiles.length > 0) {
      const newDocumentKeys: string[] = [];
      const newDocumentNames: string[] = [];

      for (const documentFile of documentFiles) {
        const documentRes = await uploadLaunchpadDocumentPresign(request, {
          contentType: documentFile.type,
          fileSize: documentFile.size,
        });

        const documentPresign = resolvePresignedUpload(documentRes.data);
        if (!documentPresign) {
          return respond(
            toLaunchpadEditActionResponse(
              errorActionResponse(
                "Unable to get a material document upload payload",
              ),
            ),
          );
        }

        const documentKey =
          getUploadKey(documentPresign) ?? getUploadKey(documentRes.data);
        if (!documentKey) {
          return respond(
            toLaunchpadEditActionResponse(
              errorActionResponse(
                "Unable to get a material document upload key",
              ),
            ),
          );
        }

        await uploadToStorage(documentPresign, documentFile);
        newDocumentKeys.push(documentKey);
        newDocumentNames.push(documentFile.name);
      }

      materialDocumentKey = newDocumentKeys;
      materialDocumentName = newDocumentNames;
    }

    const updatePayload = {
      ...parsedData,
      logoKey,
      coverKey,
      materialDocumentKey,
      materialDocumentName,
    };

    const parsed = LaunchpadUpdateInputSchema.parse(updatePayload);
    await updateLaunchpad(request, id, parsed);

    return respond(
      toLaunchpadEditActionResponse(
        successActionResponse({
          redirectTo: `/launchpad/detail/${id}`,
        }),
      ),
    );
  } catch (error) {
    console.error("Failed to update launchpad:", error);

    if (error instanceof ProtectedApiError) {
      const transformedError = transformActionResponse(error);
      return respond({
        ...toLaunchpadEditActionResponse(
          transformedError.ok
            ? successActionResponse({ redirectTo: `/launchpad/detail/${id}` })
            : errorActionResponse(
                transformedError.error ||
                  "Failed to update launchpad. Please try again.",
              ),
        ),
        error:
          transformedError.error ||
          error.message ||
          "Failed to update launchpad. Please try again.",
        fieldErrors: parseValidationFieldErrors(error.details) ?? undefined,
      });
    }

    return respond(
      toLaunchpadEditActionResponse(
        errorActionResponse("Failed to update launchpad. Please try again."),
      ),
    );
  }
}
