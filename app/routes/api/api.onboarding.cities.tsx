import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import {
  getCities,
  getCitiesByCountryName,
} from "~/services/onboarding.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const countryId = url.searchParams.get("countryId") || "";
  const countryName = url.searchParams.get("countryName") || "";
  const uuidLike =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!countryId && !countryName) {
    return Response.json(
      {
        success: false,
        message: "countryId or countryName is required",
        cities: [],
      },
      { status: 400 },
    );
  }

  if (countryId && !uuidLike.test(countryId)) {
    return Response.json(
      { success: false, message: "Invalid countryId format", cities: [] },
      { status: 400 },
    );
  }

  try {
    const result = countryId
      ? await getCities(request, countryId)
      : await getCitiesByCountryName(request, countryName);
    return Response.json(
      { success: true, countryId: countryId || undefined, cities: result.data },
      result.setCookie
        ? { headers: { "Set-Cookie": result.setCookie } }
        : undefined,
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      return Response.json(
        { success: false, message: error.message, cities: [] },
        { status: 401 },
      );
    }

    if (error instanceof ProtectedApiError) {
      return Response.json(
        { success: false, message: error.message, cities: [] },
        { status: error.status },
      );
    }

    return Response.json(
      { success: false, message: "Failed to load cities", cities: [] },
      { status: 500 },
    );
  }
}
