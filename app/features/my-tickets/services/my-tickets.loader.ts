import type { Route } from "project-types/my-tickets/route/+types/my-tickets";
import { getMyTickets } from "~/api/my-tickets/my-tickets.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

export async function myTicketsLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const url = new URL(request.url);
  const tab = url.searchParams.get("tab") === "past" ? "past" : "upcoming";
  const rawPage = Number(url.searchParams.get("page") ?? 1);
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  async function load(
    timeFilter: "upcoming" | "past",
    currentPage: number,
    limit: number,
  ) {
    try {
      return await getMyTickets(request, timeFilter, currentPage, limit);
    } catch (error) {
      if (error instanceof ProtectedApiError && error.status === 404)
        return {
          data: {
            tickets: [],
            meta: { page: currentPage, limit, total: 0, totalPages: 0 },
          },
          setCookie: undefined,
        };
      throw error;
    }
  }
  const result = await load(tab, page, 12);
  const other = await load(tab === "past" ? "upcoming" : "past", 1, 1);
  return withAuthData(
    { setCookie: other.setCookie ?? result.setCookie ?? auth.setCookie },
    {
      tab,
      tickets: result.data.tickets,
      pagination: result.data.meta,
      counts: {
        [tab]: result.data.meta.total,
        [tab === "past" ? "upcoming" : "past"]: other.data.meta.total,
      },
    },
  );
}
