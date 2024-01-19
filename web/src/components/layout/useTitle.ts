import { create } from "zustand";

type TitleState = {
  title: string;
  setTitle: (title: string) => void;
};

const useTitle = create<TitleState>((set) => ({
  title: "Keijo",
  setTitle: (title) => set({ title }),
}));

export default useTitle;
