import { create } from "zustand";
import { FileObject } from "@supabase/storage-js";

interface StateApp {
  email: string;
  setEmail: (email: string) => void;
  images: FileObject[];
  setImages: (images: FileObject[]) => void;
  uploadedImageUrl: string | null;
  setUploadedImageUrl: (uploadedImageUrl: string | null) => void;
  errorMsg: string;
  setErrorMsg: (errosMsg: string) => void;
  temporaryFile: File | null;
  setTemporaryFile: (temporaryFile: File | null) => void;
  isEmailPromptVisible: boolean;
  setIsEmailPromptVisible: (isEmailPromptVisible: boolean) => void;
}

export const useAppStore = create<StateApp>((set) => ({
  email: "",
  images: [] as FileObject[],
  setImages: (images) => set({ images }),
  setEmail: (email) => set({ email }),
  uploadedImageUrl: null,
  setUploadedImageUrl: (uploadedImageUrl) => set({ uploadedImageUrl }),
  errorMsg: "LogIn using magic link, GitHub or Google",
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  temporaryFile: null,
  setTemporaryFile: (temporaryFile) => set({ temporaryFile }),
  isEmailPromptVisible: false,
  setIsEmailPromptVisible: (isEmailPromptVisible) =>
    set({ isEmailPromptVisible }),
}));
