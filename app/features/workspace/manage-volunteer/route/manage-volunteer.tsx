import { manageVolunteerLoader } from "../services/manage-volunteer.loader";
import ManagePostingPage from "../components/pages/manage-volunteer-page";

export const loader = manageVolunteerLoader;

export function meta() {
  return [{ title: "My Volunteer | True Khmer" }];
}

export default function ManageVolunteerPage() {
  return <ManagePostingPage />;
}
