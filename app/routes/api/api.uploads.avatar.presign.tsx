import {
  AuthSessionExpiredError,
  ProtectedApiError,
  apiRequestWithSession,
} from "~/lib/server/api-client.server";

type PresignPayload = {
  fileName: string;
  contentType: string;
  fileSize: number;
};

export async function action({ request }: { request: Request }) {
  let payload: PresignPayload;
  try {
    payload = (await request.json()) as PresignPayload;
  } catch {
    return Response.json(
      { ok: false, message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { fileName, contentType, fileSize } = payload;
  if (!fileName || !contentType || !Number.isFinite(fileSize)) {
    return Response.json(
      {
        ok: false,
        message: "fileName, contentType, and fileSize are required",
      },
      { status: 400 },
    );
  }

  try {
    const result = await apiRequestWithSession<Record<string, unknown>>(
      request,
      "/uploads/avatar/presign",
      {
        method: "POST",
        body: { contentType, fileSize },
      },
    );
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
