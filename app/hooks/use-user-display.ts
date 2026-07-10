import { useMemo } from "react";
import { resolveImageURL } from "~/lib/utils";
import type { AuthenticatedUser } from "~/lib/server/types";

export interface UserDisplay {
  displayName: string;
  initials: string;
  profileImage: string;
}

/**
 * Resolves the display name, avatar initials, and profile image for a user.
 * Shared across the navbar dropdown and workspace/myspace sidebars to keep the
 * fallback logic in a single place.
 */
export function useUserDisplay(
  user: AuthenticatedUser | null | undefined,
): UserDisplay {
  return useMemo(() => {
    const displayName = user?.name || user?.email?.split("@")[0] || "User";
    const initials = displayName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const profileImage =
      resolveImageURL(user?.profile?.avatarKey) || resolveImageURL(user?.image);

    return { displayName, initials, profileImage };
  }, [user]);
}
