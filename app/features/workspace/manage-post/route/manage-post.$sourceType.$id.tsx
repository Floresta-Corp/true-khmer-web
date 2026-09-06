import { managePostDetailLoader } from "../services/manage-post-detail.loader";
import { managePostDetailAction } from "../services/manage-post-detail.action";
import ManagePostingDetailPage from "../components/pages/manage-post-detail-page";

export const loader = managePostDetailLoader;
export const action = managePostDetailAction;

export default function ManagePostDetailPage() {
  return <ManagePostingDetailPage />;
}
