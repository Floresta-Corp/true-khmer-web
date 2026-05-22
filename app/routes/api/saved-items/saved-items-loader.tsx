import { redirect } from "react-router";
import { AuthSessionExpiredError } from "~/lib/server/api-client.server";
import { getSavedItems } from "~/services/saved-items/saved-items.server";

export async function savedItemsLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? "all";
  const { forums, volunteers, launchpads } = await getSavedItems(request);
  try {
    return { forums, volunteers, launchpads, activeType: type };
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      throw redirect("/login");
    }

    throw error;
  }
}
