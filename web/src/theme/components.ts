import { PaletteMode, ThemeOptions } from "@mui/material";

const lightComponents: ThemeOptions["components"] = {
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({ "&.Mui-selected": { color: theme.palette.secondary.dark } }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: ({ theme }) => ({
        backgroundColor: theme.palette.secondary.dark,
      }),
    },
  },
};

const darkComponents: ThemeOptions["components"] = {
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({ color: theme.palette.primary.light }),
      expandIconWrapper: ({ theme }) => ({ color: theme.palette.primary.light }),
    },
  },
};

export const getComponents = (mode: PaletteMode) =>
  mode === "light" ? lightComponents : darkComponents;
