import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import { getPalette } from "./get-palette";
import useDarkModeDisabled from "./useDarkModeDisabled";

type KeijoThemeProps = {
  children: ReactNode;
};

const KeijoTheme = ({ children }: KeijoThemeProps) => {
  const { isDarkMode } = useDarkModeDisabled();
  const mode: PaletteMode = isDarkMode ? "dark" : "light";

  const theme = useMemo(() => createTheme(getPalette(mode)), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default KeijoTheme;
