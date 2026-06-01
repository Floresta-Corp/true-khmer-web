import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { ProfileDetailLoader } from "~/routes/api/profile/profile-detail/profile-detail-loader";
import ProfileDetailPage from "../pages/profile-detail-page";

export const loader = ProfileDetailLoader;

export default function ProfilePage() {
  return (
    <ForumPageLayout>
      <ProfileDetailPage />
    </ForumPageLayout>
  );
}
