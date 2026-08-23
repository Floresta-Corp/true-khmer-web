import { data } from "react-router";
import type { Route } from "project-types/admin/developer-clients/route/+types/developer-clients";
import { z } from "zod";

import {
  createDeveloperClient,
  deleteDeveloperClient,
  regenerateDeveloperClientId,
  updateDeveloperClient,
} from "~/api/admin/developer-clients/developer-clients.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import type { UpdateDeveloperClientRequest } from "../types";
import { RESTRICTED_MESSAGE } from "./developer-clients.loader";

const ALLOWED_INTENTS = new Set(["create", "update", "regenerate", "delete"]);

/** Blank strings from a form field mean "clear this value". */
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

const createSchema = z.object({
  name: nameSchema,
  description: nullableText(1000),
  contactEmail: contactEmailSchema,
});

const updateSchema = z.object({
  id: z.string().uuid("Invalid developer client ID"),
  name: nameSchema,
  description: nullableText(1000),
  contactEmail: contactEmailSchema,
  status: z.enum(["ACTIVE", "DISABLED"]),
});

const idOnlySchema = z.object({
  id: z.string().uuid("Invalid developer client ID"),
});

function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Validation failed";
}

function apiFailure(err: unknown, fallback: string) {
  if (err instanceof ProtectedApiError) {
    return data({ ok: false, message: err.message }, { status: err.status });
  }
  return data({ ok: false, message: fallback }, { status: 400 });
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
    const parsed = createSchema.safeParse({
      name: formData.get("name") ?? "",
      description: formData.get("description") ?? "",
      contactEmail: formData.get("contactEmail") ?? "",
    });
    if (!parsed.success) {
      return data(
        { ok: false, message: firstIssue(parsed.error) },
        { status: 400 },
      );
    }

    try {
      const { data: result } = await createDeveloperClient(
        request,
        parsed.data,
        accessToken,
      );
      return data(
        {
          ok: true,
          message: null,
          revealed: {
            name: result.client.name,
            clientId: result.client.clientId,
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
    const parsed = updateSchema.safeParse({
      id: formData.get("id") ?? "",
      name: formData.get("name") ?? "",
      description: formData.get("description") ?? "",
      contactEmail: formData.get("contactEmail") ?? "",
      status: formData.get("status") ?? "",
    });
    if (!parsed.success) {
      return data(
        { ok: false, message: firstIssue(parsed.error) },
        { status: 400 },
      );
    }

    const { id, ...payload } = parsed.data;
    try {
      await updateDeveloperClient(
        request,
        id,
        payload satisfies UpdateDeveloperClientRequest,
        accessToken,
      );
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
            name: result.client.name,
            clientId: result.client.clientId,
            isNew: false,
          },
        },
        cookieHeader,
      );
    } catch (err) {
      return apiFailure(err, "Failed to regenerate the client ID.");
    }
  }

  // intent === "delete"
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
