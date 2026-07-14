import { contentModeratorLoader } from "../services/content-moderator.loader";
import { contentModerationAction } from "../services/content-moderator.action";
import { contentModeratorShouldRevalidate } from "../services/content-moderator.should-revalidate";
import ContentModeratorPage from "../components/pages/content-moderator-page";

export function meta() {
  return [{ title: "Content Moderator | True Khmer" }];
}

export const loader = contentModeratorLoader;
export const action = contentModerationAction;
export const shouldRevalidate = contentModeratorShouldRevalidate;

export default function ContentModerator() {
  return <ContentModeratorPage />;
}
