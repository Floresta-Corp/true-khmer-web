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

const BACK_LABELS: Record<string, string> = {
  forum: "Back to Forum",
  launchpad: "Back to Launchpad",
  volunteer: "Back to Volunteer",
  events: "Back to Events",
  blog: "Back to Blog",
  community: "Back to Community",
  poc: "Back to POC",
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
