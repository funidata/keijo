import { Components, PaletteMode } from "@mui/material";

const lightComponents: Components = { MuiButtonBase: {} };

const darkComponents: Components = {};

export const getComponents = (mode: PaletteMode) =>
  mode === "light" ? lightComponents : darkComponents;
