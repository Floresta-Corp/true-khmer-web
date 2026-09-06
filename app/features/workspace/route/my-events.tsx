import MyEventsPage from "../components/pages/my-events-page";
import { myEventsAction } from "../services/my-events.action";
import { myEventsLoader } from "../services/my-events.loader";

export const loader = myEventsLoader;
export const action = myEventsAction;

export function meta() {
  return [{ title: "Events | True Khmer" }];
}

export default function MyEvents() {
  return <MyEventsPage />;
}
