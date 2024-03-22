import { PaletteMode, PaletteOptions } from "@mui/material";
import { grey } from "@mui/material/colors";

export const brandColors = {
  turquoise: {
    dark: "#4bbec8",
    main: "#93d8de",
    light: "#dbf2f4",
  },
  violet: {
    dark: "#8778b9",
    main: "#b7aed5",
    light: "#e7e4f1",
  },
  lime: {
    dark: "#bed630",
    main: "#d8e683",
    light: "#f2f7d6",
  },
};

const lightPalette: PaletteOptions = {
  primary: brandColors.lime,
  secondary: brandColors.violet,
  background: {
    default: "#fff",
    paper: "#fff",
  },
  text: {
    primary: grey[900],
    secondary: grey[800],
    disabled: grey[500],
  },
};

const darkPalette: PaletteOptions = {
  // palette values for dark mode
  primary: brandColors.lime,
  secondary: brandColors.violet,
  // divider: deepOrange[700],
  // background: {
  //   default: deepOrange[900],
  //   paper: deepOrange[900],
  // },
  text: {
    primary: "#fff",
    secondary: grey[500],
  },
};

export const getPalette = (mode: PaletteMode) => ({
  mode,
  ...(mode === "light" ? lightPalette : darkPalette),
});
