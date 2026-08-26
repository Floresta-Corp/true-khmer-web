import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OAuthAuthResult, OAuthSessionUser } from "../types";

interface OAuthSessionState {
  accessToken: string | null;
  user: OAuthSessionUser | null;
  setSession: (session: OAuthAuthResult) => void;
  clearSession: () => void;
}

// Remembers the popup's own login result across re-renders (e.g. toggling
// "use a different account") without threading it back through loader data.
// Scoped to sessionStorage since the popup is single-use and short-lived.
export const useOAuthSessionStore = create<OAuthSessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      clearSession: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "oauth-session",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
