import ManageVolunteerPage from "../components/pages/manage-volunteer-page";
import { manageVolunteerAction } from "../services/manage-volunteer.action";
import { manageVolunteerLoader } from "../services/manage-volunteer.loader";

export function meta() {
  return [{ title: "Manage Volunteer | True Khmer" }];
}

export const loader = manageVolunteerLoader;
export const action = manageVolunteerAction;

export default function ManageVolunteerRoute() {
  return <ManageVolunteerPage />;
}
