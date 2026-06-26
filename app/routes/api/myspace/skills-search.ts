import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { SearchSkills } from "~/routes/api/myspace/myspace.server";
import { z } from "zod";

const SearchSkillsParamsSchema = z.object({
  search: z.string().trim().optional().default(""),
  limit: z.coerce.number().int().gte(1).lte(20).optional().default(10),
});

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = SearchSkillsParamsSchema.safeParse({
    search: url.searchParams.get("search") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });

  if (!params.success) {
    return Response.json(
      { ok: false, search: "", message: "Invalid parameters", skills: [] },
      { status: 400 },
    );
  }

  const { search, limit } = params.data;

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
