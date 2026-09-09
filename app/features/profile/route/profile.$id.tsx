import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { profileLoader } from "../services/profile.loader";
import ProfileDetailPage from "../components/pages/profile-detail-page";
import type { Route } from "./+types/profile.$id";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd, personJsonLd } from "~/lib/seo/structured-data";
import { resolveImageURL } from "~/lib/utils";

export const loader = profileLoader;

export function meta(args: Route.MetaArgs) {
  const data = args.data;
  const origin = metaOrigin(args);

  if (data?.kind !== "profile" || !data.profile) {
    return pageMeta(args, {
      title: "Profile",
      description: "This member profile could not be found.",
      noindex: true,
    });
  }

  const { user, profile } = data.profile;
  const name =
    user.displayName?.trim() ||
    `${user.firstName} ${user.lastName}`.trim() ||
    "Member";
  const path = `/profile/${user.id}`;
  const avatar = profile.avatarKey ? resolveImageURL(profile.avatarKey) : null;

  return pageMeta(args, {
    title: name,
    description:
      profile.bio ||
      [user.occupation, profile.city?.name, profile.country?.name]
        .filter(Boolean)
        .join(" · ") ||
      `${name} on True Khmer.`,
    type: "profile",
    image: avatar,
    jsonLd: [
      personJsonLd({
        origin,
        pathname: path,
        name,
        description: profile.bio,
        image: avatar,
        jobTitle: user.occupation,
      }),
      breadcrumbJsonLd(origin, [
        { name: "Home", path: "/" },
        { name, path },
      ]),
    ],
  });
}

export default function ProfilePage() {
  return (
    <ForumPageLayout>
      <ProfileDetailPage />
    </ForumPageLayout>
  );
}
