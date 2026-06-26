import { data, type LoaderFunctionArgs } from "react-router";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";

export async function adminLayoutLoader({ request }: LoaderFunctionArgs) {
  const { admin, setCookie } = await requireSuperAdmin(request);

  return data(
    { admin },
    setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
  );
}
