import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import type { Route } from "project-types/settings/routes/+types/settings";
import { getTwoFactorSettings } from "~/services/api/two-factor/two-factor.server";

export async function loader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const twoFactor = await getTwoFactorSettings(request);
  return withAuthData(
    { setCookie: [auth.setCookie, twoFactor.setCookie].flatMap((cookie) =>
      Array.isArray(cookie) ? cookie : cookie ? [cookie] : [],
    ) },
    { email: auth.user.email, twoFactor: twoFactor.data },
  );
}
