import MyApplicationDetailPage from "../pages/my-application-detail-page";
import { myApplicationAction } from "../services/my-application.action";
import { myApplicationDetailLoader } from "../services/my-application-detail.loader";
import type { Route } from "./+types/my-application.$sourceType.$postingId";

export const loader = myApplicationDetailLoader;
export const action = myApplicationAction;

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.applicationTitle ?? "Application Detail";

  return [{ title: `${title} | True Khmer` }];
}

export default function MyApplicationDetailRoute() {
  return <MyApplicationDetailPage />;
}
