import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  uploadApplicationDocumentPresign,
  applyForLaunchpadRole,
  applyForLaunchpadRolesBatch,
} from "~/services/launchpad/server/launchpad.applications.server";

type UnknownRecord = Record<string, unknown>;

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

interface PresignedUpload {
  uploadUrl: string;
  method: string;
  requiredHeaders?: Record<string, string>;
  documentKey?: string;
  key?: string;
  fileKey?: string;
}

function resolvePresignedUpload(payload: unknown): PresignedUpload | null {
  const candidates: unknown[] = [
    payload,
    isRecord(payload) ? payload.upload : undefined,
    isRecord(payload) && isRecord(payload.data)
      ? payload.data.upload
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
      uploadUrl,
      method,
      requiredHeaders: readHeaders(candidate),
      documentKey:
        readStringFromKeys(candidate, ["documentKey", "document_key"]) ??
        undefined,
      key: readStringFromKeys(candidate, ["key"]) ?? undefined,
      fileKey:
        readStringFromKeys(candidate, ["fileKey", "file_key"]) ?? undefined,
    };
  }
  return null;
}

function findKeyDeep(value: unknown, depth = 0): string | null {
  if (depth > 4 || !isRecord(value)) return null;
  const direct = readStringFromKeys(value, [
    "documentKey",
    "document_key",
    "fileKey",
    "file_key",
    "key",
    "objectKey",
    "object_key",
    "storageKey",
    "storage_key",
    "path",
  ]);
  if (direct) return direct;
  for (const nested of Object.values(value)) {
    if (isRecord(nested)) {
      const found = findKeyDeep(nested, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

async function uploadToStorage(upload: PresignedUpload, file: File) {
  const headers = new Headers(upload.requiredHeaders ?? {});
  headers.set("Content-Type", file.type || "application/octet-stream");
  const response = await fetch(upload.uploadUrl, {
    method: upload.method || "PUT",
    headers,
    body: file,
  });
  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
}

function readStringArrayField(formData: FormData, key: string): string[] {
  const values = formData.getAll(key);

  if (values.length === 0) {
    return [];
  }

  if (values.length > 1) {
    return values.flatMap((value) =>
      typeof value === "string" && value.trim().length > 0 ? [value] : [],
    );
  }

  const [value] = values;
  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.flatMap((item) =>
        typeof item === "string" && item.trim().length > 0 ? [item] : [],
      );
    }
  } catch {
    // Fall through to treating the value as a single entry.
  }

  return [trimmed];
}

async function collectDocumentUploads(
  request: Request,
  launchpadId: string,
  documentFiles: File[],
) {
  const documentKeys: string[] = [];
  const documentNames: string[] = [];

  const uploadPromises = documentFiles.map(async (file) => {
    const presignRes = await uploadApplicationDocumentPresign(
      request,
      launchpadId,
      {
        contentType: file.type || "application/octet-stream",
        fileSize: file.size,
      },
    );

    const presign = resolvePresignedUpload(presignRes.data);
    if (!presign) {
      throw new Error("Unable to get document upload URL");
    }

    const key = findKeyDeep(presign) ?? findKeyDeep(presignRes.data);
    if (!key) {
      throw new Error("Unable to get document storage key");
    }

    await uploadToStorage(presign, file);

    const sanitizedName = file.name
      .replace(/[\/\\[\]\x00-\x1f\x7f]/g, "")
      .trim()
      .slice(0, 255);

    return { key, sanitizedName };
  });

  const results = await Promise.all(uploadPromises);
  for (const { key, sanitizedName } of results) {
    documentKeys.push(key);
    documentNames.push(sanitizedName);
  }

  return { documentKeys, documentNames };
}

async function submitSingleLaunchpadApplication(
  request: Request,
  formData: FormData,
) {
  const launchpadId = formData.get("launchpadId");
  const launchpadRoleId = formData.get("launchpadRoleId");
  const motivation = formData.get("motivation");
  const portfolio = formData.get("portfolio");

  if (!launchpadId || typeof launchpadId !== "string") {
    return { error: "Missing launchpad ID" };
  }
  if (!launchpadRoleId || typeof launchpadRoleId !== "string") {
    return { error: "Missing role selection" };
  }
  if (
    !motivation ||
    typeof motivation !== "string" ||
    motivation.trim().length < 5
  ) {
    return { error: "Motivation must be at least 5 characters" };
  }

  const launchpadIdValue = launchpadId.trim();
  const portfolioValue =
    typeof portfolio === "string" && portfolio.trim()
      ? portfolio.trim()
      : undefined;

  const documentFiles = formData
    .getAll("documentFiles")
    .filter((v): v is File => v instanceof File && v.size > 0);

  if (documentFiles.length > 5) {
    return { error: "Maximum 5 documents allowed" };
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  for (const file of documentFiles) {
    if (file.size > MAX_FILE_SIZE) {
      return { error: "Each document must be under 10MB" };
    }
  }

  const { documentKeys, documentNames } = await collectDocumentUploads(
    request,
    launchpadIdValue,
    documentFiles,
  );

  await applyForLaunchpadRole(request, launchpadIdValue, {
    launchpadRoleId,
    motivation: motivation.trim(),
    portfolio: portfolioValue,
    documentKeys,
    documentNames,
  });

  return { success: true };
}

async function submitBatchLaunchpadApplication(
  request: Request,
  formData: FormData,
) {
  const launchpadId = formData.get("launchpadId");
  const motivation = formData.get("motivation");
  const relevantExperience = formData.get("relevantExperience");
  const portfolio = formData.get("portfolio");
  const topPickRoleId = formData.get("topPickRoleId");
  const launchpadRoleIds = readStringArrayField(formData, "launchpadRoleIds");
  const legacyRoleIds = readStringArrayField(formData, "roleIds");
  const submittedRoleIds =
    launchpadRoleIds.length > 0 ? launchpadRoleIds : legacyRoleIds;
  const normalizedRoleIds = Array.from(
    new Set(submittedRoleIds.map((roleId) => roleId.trim()).filter(Boolean)),
  );

  if (!launchpadId || typeof launchpadId !== "string") {
    return { error: "Missing launchpad ID" };
  }
  if (
    !motivation ||
    typeof motivation !== "string" ||
    motivation.trim().length < 5
  ) {
    return { error: "Motivation must be at least 5 characters" };
  }
  if (
    !relevantExperience ||
    typeof relevantExperience !== "string" ||
    relevantExperience.trim().length < 5
  ) {
    return { error: "Relevant experience must be at least 5 characters" };
  }
  if (normalizedRoleIds.length === 0) {
    return { error: "Select at least one role" };
  }

  const launchpadIdValue = launchpadId.trim();
  const portfolioValue =
    typeof portfolio === "string" && portfolio.trim()
      ? portfolio.trim()
      : undefined;
  const topPickRoleIdValue =
    typeof topPickRoleId === "string" && topPickRoleId.trim()
      ? topPickRoleId.trim()
      : null;

  const documentFiles = formData
    .getAll("documentFiles")
    .filter((v): v is File => v instanceof File && v.size > 0);

  if (documentFiles.length > 5) {
    return { error: "Maximum 5 documents allowed" };
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  for (const file of documentFiles) {
    if (file.size > MAX_FILE_SIZE) {
      return { error: "Each document must be under 10MB" };
    }
  }

  const { documentKeys, documentNames } = await collectDocumentUploads(
    request,
    launchpadIdValue,
    documentFiles,
  );

  await applyForLaunchpadRolesBatch(request, launchpadIdValue, {
    motivation: motivation.trim(),
    portfolio: portfolioValue,
    documentKeys,
    documentNames,
    topPickRoleId: topPickRoleIdValue,
    relevantExperience: relevantExperience.trim(),
    launchpadRoleIds: normalizedRoleIds,
  });

  return { success: true };
}

export async function launchpadApplyAction({ request }: ActionFunctionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  try {
    const hasBatchFields =
      readStringArrayField(formData, "launchpadRoleIds").length > 0 ||
      readStringArrayField(formData, "roleIds").length > 0 ||
      typeof formData.get("relevantExperience") === "string";

    const result = hasBatchFields
      ? await submitBatchLaunchpadApplication(request, formData)
      : await submitSingleLaunchpadApplication(request, formData);
    return withAuthData(auth, result);
  } catch (error) {
    console.error("Failed to submit application:", error);
    if (error instanceof ProtectedApiError) {
      return withAuthData(auth, {
        error:
          error.message || "Failed to submit application. Please try again.",
      });
    }
    return withAuthData(auth, {
      error: "Failed to submit application. Please try again.",
    });
  }
}

export async function batchApplyAction({ request }: ActionFunctionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  try {
    return withAuthData(
      auth,
      await submitBatchLaunchpadApplication(request, formData),
    );
  } catch (error) {
    console.error("Failed to submit batch application:", error);
    if (error instanceof ProtectedApiError) {
      return withAuthData(auth, {
        error:
          error.message || "Failed to submit application. Please try again.",
      });
    }
    return withAuthData(auth, {
      error: "Failed to submit application. Please try again.",
    });
  }
}
