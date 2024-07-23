// import { create } from "zustand";
// import { FileObject } from "@supabase/storage-js";

// interface StateApp {
//   email: string;
//   setEmail: (email: string) => void;
//   images: FileObject[];
//   setImages: (images: FileObject[]) => void;
//   uploadedImageUrl: string | null;
//   setUploadedImageUrl: (uploadedImageUrl: string | null) => void;
//   errorMsg: string;
//   setErrorMsg: (errosMsg: string) => void;
//   tempoNextLogin: File | undefined;
//   setTempNextLogin: (tempoNextLogin: File | undefined) => void;
// }

// export const useAppStore = create<StateApp>((set) => ({
//   email: "",
//   images: [] as FileObject[],
//   setImages: (images) => set({ images }),
//   setEmail: (email) => set({ email }),
//   uploadedImageUrl: null,
//   setUploadedImageUrl: (uploadedImageUrl) => set({ uploadedImageUrl }),
//   errorMsg: "LogIn using magic link, GitHub or Google",
//   setErrorMsg: (errorMsg) => set({ errorMsg }),
//   tempoNextLogin: undefined,
//   setTempNextLogin: (tempoNextLogin) => set({ tempoNextLogin }),
// }));

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
  tempoNextLogin: File | null;
  setTempNextLogin: (tempoNextLogin: File | null) => void;
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
  tempoNextLogin: null,
  setTempNextLogin: (tempoNextLogin) => set({ tempoNextLogin }),
}));
