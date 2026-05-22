import { create } from "zustand";

interface LaunchpadSelectedRolesState {
  selectedRoleIds: string[];
  topPickRoleId: string | null;
  addRole: (roleId: string) => void;
  removeRole: (roleId: string) => void;
  setTopPick: (roleId: string) => void;
  isRoleSelected: (roleId: string) => boolean;
  isTopPick: (roleId: string) => boolean;
  clearAll: () => void;
}

export const useLaunchpadSelectedRoles = create<LaunchpadSelectedRolesState>((set, get) => ({
  selectedRoleIds: [],
  topPickRoleId: null,

  addRole: (roleId: string) => {
    set((state) => ({
      selectedRoleIds: state.selectedRoleIds.includes(roleId)
        ? state.selectedRoleIds
        : [...state.selectedRoleIds, roleId],
      topPickRoleId: state.topPickRoleId ?? roleId,
    }));
  },

  removeRole: (roleId: string) => {
    set((state) => ({
      selectedRoleIds: state.selectedRoleIds.filter((id) => id !== roleId),
      topPickRoleId: state.topPickRoleId === roleId ? null : state.topPickRoleId,
    }));
  },

  setTopPick: (roleId: string) => {
    set((state) => ({
      topPickRoleId: state.topPickRoleId === roleId ? null : roleId,
    }));
  },

  isRoleSelected: (roleId: string) => {
    return get().selectedRoleIds.includes(roleId);
  },

  isTopPick: (roleId: string) => {
    return get().topPickRoleId === roleId;
  },

  clearAll: () => {
    set({ selectedRoleIds: [], topPickRoleId: null });
  },
}));
