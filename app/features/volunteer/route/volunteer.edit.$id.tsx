import VolunteerEditPage from "../components/pages/volunteer-edit-page";
import volunteerEditLoader from "~/features/volunteer/services/volunteer-edit-loader";
import { volunteerEditAction } from "~/features/volunteer/services/volunteer-edit-action";

export const loader = volunteerEditLoader;
export const action = volunteerEditAction;

export function meta() {
  return [{ title: "Edit Volunteer Opportunity | True Khmer" }];
}

export default function VolunteerEdit() {
  return <VolunteerEditPage />;
}
