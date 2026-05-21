import ManagePostingDetailPage from "../components/pages/manage-post-page-detail";
import { managePostDetailLoader } from "~/routes/api/manage-post/manage-post-detail/post-detail.loader";
import { manageApplicantAction } from "~/routes/api/manage-post/manage-post-detail/manage-applicants.action";

export const loader = managePostDetailLoader;
export const action = manageApplicantAction;

export default function ManagePostDetailPage() {
  return <ManagePostingDetailPage />;
}
