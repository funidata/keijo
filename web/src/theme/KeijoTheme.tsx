import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import { getComponents } from "./components";
import { getPalette } from "./palette";
import useDarkMode from "./useDarkMode";

type KeijoThemeProps = {
  children: ReactNode;
};

const KeijoTheme = ({ children }: KeijoThemeProps) => {
  const { darkMode } = useDarkMode();
  const mode: PaletteMode = darkMode ? "dark" : "light";

  const theme = useMemo(
    () =>
      createTheme({
        palette: getPalette(mode),
        components: getComponents(mode),
      }),
    [mode],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default KeijoTheme;
