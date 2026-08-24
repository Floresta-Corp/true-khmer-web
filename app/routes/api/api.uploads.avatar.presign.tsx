import {
  AuthSessionExpiredError,
  ProtectedApiError,
  apiRequestWithSession,
} from "~/lib/server/api-client.server";
import {
  schemas,
  type PresignAvatarUploadRequest,
  type PresignAvatarUploadResponse,
} from "~/types/api-client";

export async function action({ request }: { request: Request }) {
  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsedPayload =
    schemas.PresignAvatarUploadRequest.safeParse(rawPayload);
  if (!parsedPayload.success) {
    return Response.json(
      {
        ok: false,
        message: "contentType and fileSize are required",
        details: parsedPayload.error.flatten(),
      },
      { status: 400 },
    );
  }

  const payload: PresignAvatarUploadRequest = parsedPayload.data;

  try {
    const result = await apiRequestWithSession<
      PresignAvatarUploadResponse,
      PresignAvatarUploadRequest
    >(request, "/uploads/avatar/presign", {
      method: "POST",
      body: payload,
    });
    return Response.json(
      result.data,
      result.setCookie
        ? { headers: { "Set-Cookie": result.setCookie } }
        : undefined,
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      return Response.json(
        { ok: false, message: error.message },
        { status: 401 },
      );
    }

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
