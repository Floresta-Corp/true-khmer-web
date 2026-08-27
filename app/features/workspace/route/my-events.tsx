import MyEventsPage from "../components/pages/my-events-page";
import { myEventsLoader } from "../services/my-events.loader";

export const loader = myEventsLoader;

export function meta() {
  return [{ title: "My Events | True Khmer" }];
}

export default function MyEvents() {
  return <MyEventsPage />;
}
