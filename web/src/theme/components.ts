import { Components, PaletteMode } from "@mui/material";
import { brandColors } from "./palette";

const lightComponents: Components = {
  MuiTab: {
    styleOverrides: {
      root: {
        "&.Mui-selected": {
          color: brandColors.violet.dark,
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: brandColors.violet.dark,
      },
    },
  },
};

const darkComponents: Components = {
  MuiAccordionSummary: {
    styleOverrides: {
      root: { color: brandColors.lime.light },
      expandIconWrapper: { color: brandColors.lime.light },
    },
  },
};

export const getComponents = (mode: PaletteMode) =>
  mode === "light" ? lightComponents : darkComponents;
