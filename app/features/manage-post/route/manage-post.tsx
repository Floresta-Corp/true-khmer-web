import { managePostLoader } from "../services/manage-post.loader";
import ManagePostingPage from "../components/pages/manage-post-page";

export const loader = managePostLoader;

export function meta() {
  return [{ title: "Manage Posting  | True Khmer" }];
}

export default function ManagePostPage() {
  return <ManagePostingPage />;
}
