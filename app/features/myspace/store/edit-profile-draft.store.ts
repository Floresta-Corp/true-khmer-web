import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { EditProfileFormData } from "~/features/myspace/lib/edit-profile-schema";

export type EditProfileDraft = {
  userId: string;
  // Only the fields that differ from the profile the draft was made against,
  // so restoring it never rolls back fields that were saved elsewhere since.
  changes: Partial<EditProfileFormData>;
};

type EditProfileDraftState = {
  draft: EditProfileDraft | null;
  saveDraft: (draft: EditProfileDraft) => void;
  clearDraft: () => void;
};

// Keeps unsaved profile edits across a reload or an accidental navigation away
// from the edit page. The avatar file itself cannot be serialised, so only a
// removed avatar survives; a newly picked image has to be chosen again.
//
// Lives in sessionStorage so personal details (phone, date of birth) die with
// the tab instead of lingering on a shared machine.
export const useEditProfileDraftStore = create<EditProfileDraftState>()(
  persist(
    (set) => ({
      draft: null,
      saveDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: "edit-profile-draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
