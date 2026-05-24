import { create } from "zustand";

interface AuthStoreState {
  email: string;
  password: string;
  rememberMe: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setRememberMe: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  email: "",
  password: "",
  rememberMe: false,
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  ...initialState,
  setEmail: (value) => set({ email: value }),
  setPassword: (value) => set({ password: value }),
  setRememberMe: (value) => set({ rememberMe: value }),
  reset: () => set(initialState),
}));
