import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { destroyAdminSession } from "~/lib/server/session.server";

export function meta() {
  return [{ title: "Admin Sign Out | True Khmer" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  return destroyAdminSession(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return destroyAdminSession(request);
}
