/**
 * Format rules for the profile's social links. The API enforces the same
 * rules (`src/utils/validation/social-link.ts` in true-khmer-api), so keep the
 * two in step.
 */

export type SocialLinkPlatform =
  | "website"
  | "linkedin"
  | "twitter"
  | "facebook";

export const SOCIAL_LINK_MAX_LENGTH = 500;

// A public domain ends in a letter TLD (or an IDN one); this rules out bare
// hosts like "https://abc", localhost and IP addresses.
const PUBLIC_HOST_RE = /\.(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/i;

// First path segments on X and Facebook that are app pages, not profiles.
const X_RESERVED_PATHS = new Set([
  "home",
  "explore",
  "i",
  "intent",
  "messages",
  "notifications",
  "search",
  "settings",
  "share",
]);
const FACEBOOK_RESERVED_PATHS = new Set([
  "home.php",
  "login",
  "login.php",
  "marketplace",
  "settings",
  "share",
  "sharer",
  "sharer.php",
  "watch",
]);

type PlatformRule = {
  label: string;
  domains: readonly string[];
  example: string;
  isProfile: (url: URL) => boolean;
};

const PLATFORM_RULES: Record<
  Exclude<SocialLinkPlatform, "website">,
  PlatformRule
> = {
  linkedin: {
    label: "LinkedIn",
    domains: ["linkedin.com"],
    example: "https://www.linkedin.com/in/your-name",
    isProfile: (url) =>
      /^\/(?:in|company|school|showcase)\/[^/]+/i.test(url.pathname),
  },
  twitter: {
    label: "Twitter",
    domains: ["x.com", "twitter.com"],
    example: "https://x.com/yourhandle",
    isProfile: (url) => {
      const handle = url.pathname.split("/")[1] ?? "";
      return (
        /^[A-Za-z0-9_]{1,15}$/.test(handle) &&
        !X_RESERVED_PATHS.has(handle.toLowerCase())
      );
    },
  },
  facebook: {
    label: "Facebook",
    domains: ["facebook.com", "fb.com"],
    example: "https://www.facebook.com/yourname",
    isProfile: (url) => {
      const first = url.pathname.split("/").find(Boolean)?.toLowerCase();
      if (!first) return false;
      if (first === "profile.php") {
        return /^\d+$/.test(url.searchParams.get("id") ?? "");
      }
      return !FACEBOOK_RESERVED_PATHS.has(first);
    },
  },
};

function hostMatches(host: string, domains: readonly string[]) {
  return domains.some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );
}

/**
 * Why `value` is not an acceptable link for `platform`, or `null` when it is.
 * An empty value is acceptable: every social link is optional.
 */
export function getSocialLinkError(
  platform: SocialLinkPlatform,
  value: string,
): string | null {
  const rule = platform === "website" ? null : PLATFORM_RULES[platform];
  const label = rule?.label ?? "Website";
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.length > SOCIAL_LINK_MAX_LENGTH) {
    return `${label} must be ${SOCIAL_LINK_MAX_LENGTH} characters or fewer`;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return `${label} must be a valid URL starting with https://`;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return `${label} must be a valid URL starting with https://`;
  }

  if (url.username || url.password) {
    return `${label} must not contain a username or password`;
  }

  const host = url.hostname.toLowerCase();
  if (!PUBLIC_HOST_RE.test(host)) {
    return `${label} must use a full domain, like example.com`;
  }

  if (!rule) return null;

  if (!hostMatches(host, rule.domains)) {
    return `${label} must be a ${rule.domains[0]} link`;
  }

  if (!rule.isProfile(url)) {
    return `${label} must link to a profile, like ${rule.example}`;
  }

  return null;
}
