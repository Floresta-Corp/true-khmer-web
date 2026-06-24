import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { ProfileLoader } from "../services/profile.loader";
import ProfileDetailPage from "../page";
import type { Route } from "./+types/profile.$id";

export const loader = ProfileLoader;

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
