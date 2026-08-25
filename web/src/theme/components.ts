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
  MuiButton: {
    styleOverrides: {
      outlined: ({ theme }) => ({
        color: theme.palette.secondary.dark,
        borderColor: theme.palette.secondary.dark,
      }),
      text: ({ theme }) => ({
        color: theme.palette.secondary.dark,
      }),
    },
  },
  MuiBadge: {
    defaultProps: {
      color: "secondary",
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
  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-error": {
          color: theme.palette.error.contrastText,
        },
      }),
    },
  },
  MuiBadge: {
    defaultProps: {
      color: "primary",
    },
  },
};

export const getComponents = (mode: PaletteMode) =>
  mode === "light" ? lightComponents : darkComponents;
