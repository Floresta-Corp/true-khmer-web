export function sanitizeRedirectPath(
  value: string | null | undefined,
  fallback = "/",
) {
  if (!value) return fallback;

  const redirectTo = value.trim();
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback;
  }

  return redirectTo;
}

export function withRedirectTo(path: string, value: string | null | undefined) {
  const redirectTo = sanitizeRedirectPath(value);
  if (redirectTo === "/") return path;

  return `${path}?redirectTo=${encodeURIComponent(redirectTo)}`;
}

// A signup started from the OAuth authorization page carries this flag inside
// its redirectTo. When present, register/OTP skip onboarding and send the user
// straight back to the authorization, where the session they just created is
// read from the `__session` cookie and the consent card takes over.
export const OAUTH_RESUME_PARAM = "oauthResume";

export function isOAuthResumeRedirect(value: string | null | undefined) {
  const redirectTo = sanitizeRedirectPath(value);
  if (redirectTo === "/") return false;

  const [pathname, query = ""] = redirectTo.split("?");
  return (
    pathname.startsWith("/oauth/") &&
    new URLSearchParams(query).get(OAUTH_RESUME_PARAM) === "1"
  );
}

// `/workspace/manage-post` was split into `/workspace/volunteer` and
// `/workspace/launchpad`. Notifications still carry the old path, and the
// backend builds it by concatenation, so it arrives in a few broken shapes:
// a missing `/workspace` prefix, a missing separator before the source type
// ("manage-postvolunteer"), or the API's own "manage-posting" spelling.
const MANAGE_POST_DESTINATIONS: Record<
  string,
  { listing: string; detail: string }
> = {
  volunteer: {
    listing: "/workspace/volunteer",
    detail: "/workspace/volunteer",
  },
  launchpad: { listing: "/workspace/launchpad", detail: "/workspace/projects" },
  projects: { listing: "/workspace/launchpad", detail: "/workspace/projects" },
};

const MANAGE_POST_PATTERN =
  /^\/(?:workspace\/)?manage-post(?:ing)?\/?(volunteer|launchpad|projects)?\/?([^/?#]*)/;

/**
 * Maps a legacy manage-post path onto its current route, or returns null when
 * the path is not a manage-post one. `path` is a pathname without a query.
 */
export function resolveLegacyManagePostRoute(path: string) {
  const match = MANAGE_POST_PATTERN.exec(path);
  if (!match) return null;

  const [, sourceType, id] = match;
  const destination = sourceType
    ? MANAGE_POST_DESTINATIONS[sourceType]
    : undefined;
  if (!destination) return "/workspace";

  return id ? `${destination.detail}/${id}` : destination.listing;
}

const BACK_LABELS: Record<string, string> = {
  forum: "Back to Forum",
  launchpad: "Back to Launchpad",
  volunteer: "Back to Volunteer",
  events: "Back to Events",
  blog: "Back to Blog",
  community: "Back to Community",
  poc: "Back to POC",
  oauth: "Back to Sign In",
  about: "Back to About",
  profile: "Back to Profile",
};

const GATED_SEGMENTS = new Set(["create", "edit", "new"]);

const GATED_ROOTS = new Set([
  "complete-signup",
  "dashboard",
  "edit-profile",
  "messages",
  "my-applications",
  "my-events",
  "my-ticket",
  "myspace",
  "notifications",
  "onboarding",
  "saved-items",
  "settings",
  "workspace",
]);

function publicAncestorOf(path: string) {
  const segments = path.split("?")[0].split("/").filter(Boolean);
  const root = segments[0];

  if (!root || GATED_ROOTS.has(root)) return "/";
  if (segments.some((segment) => GATED_SEGMENTS.has(segment)))
    return `/${root}`;

  return path;
}

export function getBackDestination(value: string | null | undefined) {
  const to = publicAncestorOf(sanitizeRedirectPath(value));
  const segment = to.split("?")[0].split("/").filter(Boolean)[0];

  if (!segment) return { to: "/", label: "Back to Home" };

  return { to, label: BACK_LABELS[segment] ?? "Back" };
}
