import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type RegisterDraft = {
  participation: "member" | "partner";
  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: string;
  contactNumber: string;
  gender: string;
  occupation: string;
  agreeToDirectory: boolean;
};

type RegisterDraftState = {
  draft: RegisterDraft | null;
  saveDraft: (draft: RegisterDraft) => void;
  clearDraft: () => void;
};

// Keeps the sign-up answers alive across a reload or an accidental navigation
// away: the register form is long, and its action redirects to OTP
// verification, so anything held only in component state is gone the moment
// the page unmounts.
//
// Passwords are deliberately never part of the draft, and it lives in
// sessionStorage so it dies with the tab instead of lingering on a shared
// machine.
export const useRegisterDraftStore = create<RegisterDraftState>()(
  persist(
    (set) => ({
      draft: null,
      saveDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: "register-draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
