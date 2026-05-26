import ManagePostingDetailPage from "../components/pages/manage-post-detail-page";
import { managePostDetailLoader } from "~/routes/api/manage-post/manage-post-detail/manage-post-detail.loader";
import { managePostDetailAction } from "~/routes/api/manage-post/manage-post-detail/manage-post-detail.action";

export const loader = managePostDetailLoader;
export const action = managePostDetailAction;

export default function ManagePostDetailPage() {
  return <ManagePostingDetailPage />;
}
