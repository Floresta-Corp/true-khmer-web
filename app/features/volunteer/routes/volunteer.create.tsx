import VolunteerPostPage from "../page/volunteer-post-page";
import volunteerCreateLoader from "~/routes/api/volunteer/volunteer-create/volunteer-create-loader";
import { volunteerCreateAction } from "~/routes/api/volunteer/volunteer-create/volunteer-create-action";

export const loader = volunteerCreateLoader;
export const action = volunteerCreateAction;

export function meta() {
  return [{ title: "Create Volunteer Opportunity | True Khmer" }];
}

export default function VolunteerCreate() {
  return <VolunteerPostPage />;
}
