import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { SearchSkills } from "~/services/myspace/server/me.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const limitParam = Number(url.searchParams.get("limit") ?? 10);
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), 20)
    : 10;

  if (!search) {
    return Response.json({ ok: true, search, skills: [] });
  }

  try {
    const result = await SearchSkills(request, search, limit);

    return Response.json(
      { ...result.data, search },
      result.setCookie
        ? { headers: { "Set-Cookie": result.setCookie } }
        : undefined,
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      return Response.json(
        { ok: false, search, message: error.message, skills: [] },
        { status: 401 },
      );
    }

    if (error instanceof ProtectedApiError) {
      return Response.json(
        { ok: false, search, message: error.message, skills: [] },
        { status: error.status },
      );
    }

    return Response.json(
      { ok: false, search, message: "Failed to search skills", skills: [] },
      { status: 500 },
    );
  }
}
