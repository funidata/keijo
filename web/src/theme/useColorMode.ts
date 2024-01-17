import { PaletteMode } from "@mui/material";
import { create } from "zustand";

const useColorMode = create<{
  mode: PaletteMode;
  setColorMode: (mode: PaletteMode) => void;
  toggle: () => void;
}>((set) => ({
  mode: "light",
  setColorMode: (mode) => set({ mode }),
  toggle: () => set(({ mode }) => ({ mode: mode === "dark" ? "light" : "dark" })),
}));

export default useColorMode;
