import MyApplicationDetailPage from "../pages/my-application-detail-page";
import { MyApplicationAction } from "~/routes/api/myspace/my-application-action";
import { MyApplicationDetailLoader } from "~/routes/api/myspace/my-application-detail-loader";
import type { Route } from "./+types/my-application.$sourceType.$postingId";

export const loader = MyApplicationDetailLoader;
export const action = MyApplicationAction;

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.applicationTitle ?? "Application Detail";

  return [{ title: `${title} | True Khmer` }];
}

export default function MyApplicationDetailRoute() {
  return <MyApplicationDetailPage />;
}
