import VolunteerEditPage from "../page/volunteer-edit-page";
import volunteerEditLoader from "~/routes/api/volunteer/volunteer-edit/volunteer-edit-loader";
import { volunteerEditAction } from "~/routes/api/volunteer/volunteer-edit/volunteer-edit-action";

export const loader = volunteerEditLoader;
export const action = volunteerEditAction;

export function meta() {
  return [{ title: "Edit Volunteer Opportunity | True Khmer" }];
}

export default function VolunteerEdit() {
  return <VolunteerEditPage />;
}
