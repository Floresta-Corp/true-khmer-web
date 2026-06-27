import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { profileLoader } from "../services/profile.loader";
import ProfileDetailPage from "../components/pages/profile-detail-page";
import type { Route } from "./+types/profile.$id";

export const loader = profileLoader;

export function meta({ data }: Route.MetaArgs) {
  if (data?.kind === "profile" && data.profile) {
    const name =
      data.profile.user.displayName ??
      `${data.profile.user.firstName} ${data.profile.user.lastName}`;
    return [{ title: `${name} | True Khmer` }];
  }
  return [{ title: "Profile | True Khmer" }];
}

export default function ProfilePage() {
  return (
    <ForumPageLayout>
      <ProfileDetailPage />
    </ForumPageLayout>
  );
}
