import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { ProfileDetailLoader } from "~/routes/api/profile/profile-detail/profile-detail-loader";
import ProfileDetailPage from "../pages/profile-detail-page";
import type { Route } from "./+types/profile.$id";

export const loader = ProfileDetailLoader;

export function meta({ data }: Route.MetaArgs) {
  if (data?.kind === "profile") {
    const name =
      data.profile?.user.displayName ??
      `${data.profile?.user.firstName} ${data.profile?.user.lastName}`;
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
