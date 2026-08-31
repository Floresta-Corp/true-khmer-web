import ManageEducationDetailPage from "../components/pages/manage-education-detail-page";
import { manageEducationDetailAction } from "../services/manage-education-detail.action";
import { manageEducationDetailLoader } from "../services/manage-education-detail.loader";

export function meta() {
  return [{ title: "Course Review | True Khmer" }];
}

export const loader = manageEducationDetailLoader;
export const action = manageEducationDetailAction;

export default function ManageEducationDetailRoute() {
  return <ManageEducationDetailPage />;
}
