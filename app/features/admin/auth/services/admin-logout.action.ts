import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { destroyAdminSession } from "~/lib/server/session.server";

export async function adminLogoutAction({ request }: ActionFunctionArgs) {
  return destroyAdminSession(request, { callApi: true });
}

export async function adminLogoutLoader({ request }: LoaderFunctionArgs) {
  return destroyAdminSession(request, { callApi: false });
}
