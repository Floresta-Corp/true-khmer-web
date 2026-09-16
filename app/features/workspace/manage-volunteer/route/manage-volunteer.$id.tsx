import { manageVolunteerDetailLoader } from "../services/manage-volunteer-detail.loader";
import { manageVolunteerDetailAction } from "../services/manage-volunteer-detail.action";
import ManagePostingDetailPage from "../components/pages/manage-volunteer-detail-page";

export const loader = manageVolunteerDetailLoader;
export const action = manageVolunteerDetailAction;

export default function ManageVolunteerDetailPage() {
  return <ManagePostingDetailPage />;
}
