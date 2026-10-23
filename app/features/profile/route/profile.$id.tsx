import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { profileLoader } from "../services/profile.loader";
import ProfileDetailPage from "../components/pages/profile-detail-page";
import type { Route } from "./+types/profile.$id";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd, personJsonLd } from "~/lib/seo/structured-data";
import { resolveImageURL } from "~/lib/utils";
import { ProfilePageLayout } from "../components/profile-page-layout";

export const loader = profileLoader;

/**
 * What a profile shows depends on who is looking and on the owner's current
 * visibility settings, so neither the document nor its `.data` requests may be
 * cached by the browser or a CDN.
 */
export function headers(_: Route.HeadersArgs) {
  return {
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
    Vary: "Cookie",
  };
}

/** Always refetch: visibility can change between any two navigations. */
export function shouldRevalidate() {
  return true;
}

export function meta(args: Route.MetaArgs) {
  const data = args.data;
  const origin = metaOrigin(args);

  if (data?.kind === "restricted") {
    return pageMeta(args, {
      title: "Profile",
      description:
        data.code === "PROFILE_MEMBERS_ONLY"
          ? "This profile is only visible to True Khmer members."
          : "This profile is private.",
      noindex: true,
    });
  }

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
    <ProfilePageLayout>
      <ProfileDetailPage />
    </ProfilePageLayout>
  );
}
