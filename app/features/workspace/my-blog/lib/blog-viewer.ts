import type { AuthenticatedUser } from "~/lib/server/types";

export interface BlogViewer {
  name: string;
  avatarKey: string | null;
}

/** The byline a new blog will be published under: the signed-in account. */
export function toBlogViewer(user: AuthenticatedUser): BlogViewer {
  return {
    name: user.name || user.email?.split("@")[0] || "You",
    avatarKey: user.profile?.avatarKey ?? user.image ?? null,
  };
}
