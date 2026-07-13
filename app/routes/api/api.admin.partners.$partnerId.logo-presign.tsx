import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { presignManagedPartnerLogo } from "~/api/admin/partners/partners.server";

type PresignPayload = {
  contentType: string;
  fileSize: number;
};

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { partnerId?: string };
}) {
  await requireSuperAdmin(
    request,
    "Partner management is restricted to Super Admins.",
  );

  const partnerId = params.partnerId;
  if (!partnerId) {
    return Response.json(
      { ok: false, message: "Partner ID is required" },
      { status: 400 },
    );
  }

  let payload: PresignPayload;
  try {
    payload = (await request.json()) as PresignPayload;
  } catch {
    return Response.json(
      { ok: false, message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { contentType, fileSize } = payload;
  if (!contentType || !Number.isFinite(fileSize)) {
    return Response.json(
      { ok: false, message: "contentType and fileSize are required" },
      { status: 400 },
    );
  }

  try {
    const result = await presignManagedPartnerLogo(request, partnerId, {
      contentType,
      fileSize,
    });
    return Response.json(
      result.data,
      result.setCookie
        ? { headers: { "Set-Cookie": result.setCookie } }
        : undefined,
    );
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return Response.json(
        { ok: false, message: error.message, details: error.details },
        { status: error.status },
      );
    }

    return Response.json(
      { ok: false, message: "Upload unavailable, try again." },
      { status: 500 },
    );
  }
}

export async function loader() {
  return Response.json(
    { ok: false, message: "Method not allowed" },
    { status: 405 },
  );
}
