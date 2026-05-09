import type { ActionFunctionArgs } from "react-router";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  uploadApplicationDocumentPresign,
  applyForLaunchpadRole,
} from "~/services/launchpad/server/launchpad.applications.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

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

export async function launchpadApplyAction({ request }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

  const formData = await request.formData();

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
    motivation.trim().length < 10
  ) {
    return { error: "Motivation must be at least 10 characters" };
  }
  const portfolioValue =
    typeof portfolio === "string" && portfolio.trim()
      ? portfolio.trim()
      : undefined;

  try {
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

    const documentKeys: string[] = [];
    const documentNames: string[] = [];

    // Upload files in parallel for better performance
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

      // Sanitize file name - remove path separators and control characters
      const sanitizedName = file.name.replace(/[/\\[\]Control-]/g, "").slice(0, 255);

      return { key, sanitizedName };
    });

    const results = await Promise.all(uploadPromises);
    for (const { key, sanitizedName } of results) {
      documentKeys.push(key);
      documentNames.push(sanitizedName);
    }

    await applyForLaunchpadRole(request, launchpadId, {
      launchpadRoleId,
      motivation: motivation.trim(),
      portfolio: portfolioValue,
      documentKeys,
      documentNames,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit application:", error);
    if (error instanceof ProtectedApiError) {
      return {
        error:
          error.message || "Failed to submit application. Please try again.",
      };
    }
    return { error: "Failed to submit application. Please try again." };
  }
}
