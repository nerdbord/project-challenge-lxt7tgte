import { create } from "zustand";

interface StateApp {
  email: string;
  setEmail: (email: string) => void;
}

export const useAppStore = create<StateApp>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
}));
