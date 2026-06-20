import { contentModerationAction } from "~/features/admin/contentmoderator/service/content-moderator.action";
import ContentModeratingPage from "../pages/content-moderator-page";
import { contentModeratorLoader } from "~/features/admin/contentmoderator/service/content-moderator.loder";

// ── meta ───────────────────────────────────────────────────────────────────
export function meta() {
  return [{ title: "Content Moderator | True Khmer" }];
}

export const loader = contentModeratorLoader;
export const action = contentModerationAction;
export default function ContentModeratorPage() {
  return <ContentModeratingPage />;
}
