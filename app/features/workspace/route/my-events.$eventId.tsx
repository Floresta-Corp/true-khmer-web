import type { Route } from "project-types/workspace/route/+types/my-events.$eventId";
import MyEventDetailPage from "../components/pages/my-event-detail-page";
import { myEventDetailLoader } from "../services/my-event-detail.loader";

export const loader = myEventDetailLoader;

export function meta({ data }: Route.MetaArgs) {
  const title = data?.event?.title;
  return [{ title: title ? `${title} | True Khmer` : "Event | True Khmer" }];
}

export default function MyEventDetail() {
  return <MyEventDetailPage />;
}
