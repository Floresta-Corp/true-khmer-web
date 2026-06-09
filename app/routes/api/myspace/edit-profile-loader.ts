import type { Route as EditProfileRoute } from "project-types/myspace/routes/+types/edit-profile";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  GetMyspaceMe,
  GetCountries,
  GetCities,
} from "~/services/myspace/server/me.server";
import type { City, Profile, Country } from "~/services/myspace/types";

interface EditProfileLoaderData {
  me: Profile | null;
  userId: string | null;
  countries: Country[];
  cities: City[];
}

export async function EditProfileLoader({
  request,
}: EditProfileRoute.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams.toString());
  const auth = await requireUser(request);
  const userId = auth.user.id;
  const meResult = await GetMyspaceMe(request);

  // Prefer the countryId from the URL, fall back to the user's existing profile country
  const countryId =
    searchParams.get("countryId") ||
    meResult.data.profile?.profile?.country?.id ||
    "";

  const countriesResult = await GetCountries(request);
  const citiesResult = countryId
    ? await GetCities(request, countryId)
    : { data: { cities: [] } };

  return withAuthData(auth, {
    userId,
    me: meResult.data.profile,
    countries: countriesResult.data.countries || [],
    cities: citiesResult.data.cities || [],
  } satisfies EditProfileLoaderData);
}
