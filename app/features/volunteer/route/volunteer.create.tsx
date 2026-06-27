import VolunteerPostPage from "../components/pages/volunteer-post-page";
import volunteerCreateLoader from "~/features/volunteer/services/volunteer-create-loader";
import { volunteerCreateAction } from "~/features/volunteer/services/volunteer-create-action";

export const loader = volunteerCreateLoader;
export const action = volunteerCreateAction;

export function meta() {
  return [{ title: "Create Volunteer Opportunity | True Khmer" }];
}

export default function VolunteerCreate() {
  return <VolunteerPostPage />;
}
