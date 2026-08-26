import { data } from "react-router";
import type { Route } from "project-types/admin/developer-clients/route/+types/developer-clients";
import { z } from "zod";

import {
  createDeveloperClient,
  deleteDeveloperClient,
  regenerateDeveloperClientId,
  regenerateDeveloperClientSecret,
  updateDeveloperClient,
  uploadDeveloperClientLogo,
} from "~/api/admin/developer-clients/developer-clients.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import type {
  CreateDeveloperClientRequest,
  DeveloperClientResponse,
  UpdateDeveloperClientRequest,
} from "~/types/api-client";
import { validateLogoFile } from "../lib/logo";
import { MAX_ALLOWED_ORIGINS, parseOriginsField } from "../lib/origins";
import {
  MAX_ANDROID_FINGERPRINTS,
  parseFingerprintsField,
} from "../lib/android-fingerprints";
import { RESTRICTED_MESSAGE } from "./developer-clients.loader";

const ALLOWED_INTENTS = new Set([
  "create",
  "update",
  "regenerate",
  "regenerate-secret",
  "delete",
]);

const nullableText = (max: number) =>
  z
    .string()
    .max(max, `Must be at most ${max} characters`)
    .transform((value) => {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    })
    .nullable()
    .optional();

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(120, "Name must be at most 120 characters");

const contactEmailSchema = z
  .string()
  .max(255, "Email must be at most 255 characters")
  .transform((value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  })
  .nullable()
  .optional()
  .refine(
    (value) =>
      value === null ||
      value === undefined ||
      z.string().email().safeParse(value).success,
    "Enter a valid email address",
  );

const allowedOriginsSchema = z
  .array(z.string())
  .max(MAX_ALLOWED_ORIGINS, `At most ${MAX_ALLOWED_ORIGINS} origins`);

const androidFingerprintsSchema = z
  .array(z.string())
  .max(
    MAX_ANDROID_FINGERPRINTS,
    `At most ${MAX_ANDROID_FINGERPRINTS} Android fingerprints`,
  );

const platformFields = {
  clientType: z.enum(["WEB", "IOS", "ANDROID"]),
  iosBundleIdentifier: z.string().trim().max(255).optional(),
  androidPackageName: z.string().trim().max(255).optional(),
  androidSha1Fingerprints: androidFingerprintsSchema,
};

function validatePlatformFields(
  data: {
    clientType: DeveloperClientResponse["clientType"];
    allowedOrigins: string[];
    iosBundleIdentifier?: string;
    androidPackageName?: string;
    androidSha1Fingerprints: string[];
  },
  ctx: z.RefinementCtx,
) {
  if (data.clientType === "WEB") return;
  if (data.allowedOrigins.length > 0) {
    ctx.addIssue({
      code: "custom",
      path: ["allowedOrigins"],
      message: "Native clients do not use allowed origins",
    });
  }
  if (data.clientType === "IOS" && !data.iosBundleIdentifier) {
    ctx.addIssue({
      code: "custom",
      path: ["iosBundleIdentifier"],
      message: "Bundle identifier is required for an iOS client",
    });
  }
  if (data.clientType === "ANDROID") {
    if (!data.androidPackageName) {
      ctx.addIssue({
        code: "custom",
        path: ["androidPackageName"],
        message: "Package name is required for an Android client",
      });
    }
    if (data.androidSha1Fingerprints.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["androidSha1Fingerprints"],
        message: "Add at least one Android signing SHA-1",
      });
    }
  }
}

const createSchema = z
  .object({
    ...platformFields,
    name: nameSchema,
    description: nullableText(1000),
    contactEmail: contactEmailSchema,
    allowedOrigins: allowedOriginsSchema,
    logoKey: nullableText(512),
  })
  .superRefine(validatePlatformFields);

const updateSchema = z
  .object({
    ...platformFields,
    id: z.string().uuid("Invalid developer client ID"),
    name: nameSchema,
    description: nullableText(1000),
    contactEmail: contactEmailSchema,
    status: z.enum(["ACTIVE", "DISABLED"]),
    allowedOrigins: allowedOriginsSchema,
    logoKey: nullableText(512),
  })
  .superRefine(validatePlatformFields);

function platformPayload(data: {
  clientType: DeveloperClientResponse["clientType"];
  allowedOrigins: string[];
  iosBundleIdentifier?: string;
  androidPackageName?: string;
  androidSha1Fingerprints: string[];
}) {
  if (data.clientType === "WEB") {
    return { clientType: data.clientType, allowedOrigins: data.allowedOrigins };
  }
  if (data.clientType === "IOS") {
    return {
      clientType: data.clientType,
      allowedOrigins: [],
      iosBundleIdentifier: data.iosBundleIdentifier,
    };
  }
  return {
    clientType: data.clientType,
    allowedOrigins: [],
    androidPackageName: data.androidPackageName,
    androidSha1Fingerprints: data.androidSha1Fingerprints,
  };
}

const idOnlySchema = z.object({
  id: z.string().uuid("Invalid developer client ID"),
});

function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Validation failed";
}

function zodIssueMessage(details: unknown): string | null {
  if (typeof details !== "object" || details === null) return null;

  const error = (details as { error?: unknown }).error;
  if (typeof error !== "object" || error === null) return null;

  const raw = (error as { message?: unknown }).message;
  if (typeof raw !== "string") return null;

  try {
    const issues = JSON.parse(raw);
    if (!Array.isArray(issues) || issues.length === 0) return null;

    const [issue] = issues;
    const message = typeof issue?.message === "string" ? issue.message : null;
    if (!message) return null;

    const path = Array.isArray(issue.path) ? issue.path.join(".") : "";
    return path ? `${path}: ${message}` : message;
  } catch {
    return null;
  }
}

function apiFailure(err: unknown, fallback: string) {
  if (err instanceof ProtectedApiError) {
    const message = zodIssueMessage(err.details) ?? err.message;
    return data({ ok: false, message }, { status: err.status });
  }
  return data({ ok: false, message: fallback }, { status: 400 });
}

type LogoResult =
  | { ok: true; logoKey: string }
  | { ok: false; message: string };

/**
 * Resolves the logo to store: a freshly uploaded file wins, otherwise the key
 * the form sent back (empty when the admin removed the logo).
 */
async function resolveLogoKey(
  request: Request,
  formData: FormData,
  accessToken: string,
): Promise<LogoResult> {
  const file = formData.get("logoFile");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: true, logoKey: String(formData.get("logoKey") ?? "") };
  }

  const invalid = validateLogoFile(file);
  if (invalid) return { ok: false, message: invalid };

  try {
    const logoKey = await uploadDeveloperClientLogo(request, file, accessToken);
    return { ok: true, logoKey };
  } catch (err) {
    if (err instanceof ProtectedApiError) {
      return { ok: false, message: err.message };
    }
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Failed to upload the logo.",
    };
  }
}

export async function developerClientsAction({ request }: Route.ActionArgs) {
  const { accessToken, setCookie } = await requireSuperAdmin(
    request,
    RESTRICTED_MESSAGE,
  );

  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "").trim();

  if (!ALLOWED_INTENTS.has(intent)) {
    return data(
      { ok: false, message: "Unknown action intent" },
      { status: 400 },
    );
  }

  if (intent === "create") {
    const logo = await resolveLogoKey(request, formData, accessToken);
    if (!logo.ok) {
      return data({ ok: false, message: logo.message }, { status: 400 });
    }

    const parsed = createSchema.safeParse({
      clientType: formData.get("clientType") ?? "",
      name: formData.get("name") ?? "",
      description: formData.get("description") ?? "",
      contactEmail: formData.get("contactEmail") ?? "",
      allowedOrigins: parseOriginsField(formData.get("allowedOrigins")),
      iosBundleIdentifier: formData.get("iosBundleIdentifier") ?? "",
      androidPackageName: formData.get("androidPackageName") ?? "",
      androidSha1Fingerprints: parseFingerprintsField(
        formData.get("androidSha1Fingerprints"),
      ),
      logoKey: logo.logoKey,
    });
    if (!parsed.success) {
      return data(
        { ok: false, message: firstIssue(parsed.error) },
        { status: 400 },
      );
    }

    try {
      const payload: CreateDeveloperClientRequest = {
        name: parsed.data.name,
        description: parsed.data.description,
        contactEmail: parsed.data.contactEmail,
        logoKey: parsed.data.logoKey,
        ...platformPayload(parsed.data),
      };
      const { data: result } = await createDeveloperClient(
        request,
        payload,
        accessToken,
      );
      return data(
        {
          ok: true,
          message: null,

          revealed: {
            kind: "clientSecret" as const,
            name: result.client.name,
            value: result.clientSecret,
            isNew: true,
          },
        },
        cookieHeader,
      );
    } catch (err) {
      return apiFailure(err, "Failed to create developer client.");
    }
  }

  if (intent === "update") {
    const logo = await resolveLogoKey(request, formData, accessToken);
    if (!logo.ok) {
      return data({ ok: false, message: logo.message }, { status: 400 });
    }

    const parsed = updateSchema.safeParse({
      clientType: formData.get("clientType") ?? "",
      id: formData.get("id") ?? "",
      name: formData.get("name") ?? "",
      description: formData.get("description") ?? "",
      contactEmail: formData.get("contactEmail") ?? "",
      status: formData.get("status") ?? "",
      allowedOrigins: parseOriginsField(formData.get("allowedOrigins")),
      iosBundleIdentifier: formData.get("iosBundleIdentifier") ?? "",
      androidPackageName: formData.get("androidPackageName") ?? "",
      androidSha1Fingerprints: parseFingerprintsField(
        formData.get("androidSha1Fingerprints"),
      ),
      logoKey: logo.logoKey,
    });
    if (!parsed.success) {
      return data(
        { ok: false, message: firstIssue(parsed.error) },
        { status: 400 },
      );
    }

    const { id } = parsed.data;
    const payload: UpdateDeveloperClientRequest = {
      name: parsed.data.name,
      description: parsed.data.description,
      contactEmail: parsed.data.contactEmail,
      status: parsed.data.status,
      logoKey: parsed.data.logoKey,
      ...platformPayload(parsed.data),
    };
    try {
      await updateDeveloperClient(request, id, payload, accessToken);
      return data({ ok: true, message: null }, cookieHeader);
    } catch (err) {
      return apiFailure(err, "Failed to update developer client.");
    }
  }

  if (intent === "regenerate") {
    const parsed = idOnlySchema.safeParse({ id: formData.get("id") ?? "" });
    if (!parsed.success) {
      return data(
        { ok: false, message: firstIssue(parsed.error) },
        { status: 400 },
      );
    }

    try {
      const { data: result } = await regenerateDeveloperClientId(
        request,
        parsed.data.id,
        accessToken,
      );
      return data(
        {
          ok: true,
          message: null,
          revealed: {
            kind: "clientId" as const,
            name: result.client.name,
            value: result.client.clientId,
            isNew: false,
          },
        },
        cookieHeader,
      );
    } catch (err) {
      return apiFailure(err, "Failed to regenerate the client ID.");
    }
  }

  if (intent === "regenerate-secret") {
    const parsed = idOnlySchema.safeParse({ id: formData.get("id") ?? "" });
    if (!parsed.success) {
      return data(
        { ok: false, message: firstIssue(parsed.error) },
        { status: 400 },
      );
    }

    try {
      const { data: result } = await regenerateDeveloperClientSecret(
        request,
        parsed.data.id,
        accessToken,
      );
      return data(
        {
          ok: true,
          message: null,
          revealed: {
            kind: "clientSecret" as const,
            name: result.client.name,
            value: result.clientSecret,
            isNew: false,
          },
        },
        cookieHeader,
      );
    } catch (err) {
      return apiFailure(err, "Failed to regenerate the client secret.");
    }
  }

  const parsed = idOnlySchema.safeParse({ id: formData.get("id") ?? "" });
  if (!parsed.success) {
    return data(
      { ok: false, message: firstIssue(parsed.error) },
      { status: 400 },
    );
  }

  try {
    await deleteDeveloperClient(request, parsed.data.id, accessToken);
    return data({ ok: true, message: null }, cookieHeader);
  } catch (err) {
    return apiFailure(err, "Failed to delete developer client.");
  }
}
