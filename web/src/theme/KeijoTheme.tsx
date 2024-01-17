import { PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import { useDarkMode } from "usehooks-ts";
import { getPalette } from "./get-palette";

type KeijoThemeProps = {
  children: ReactNode;
};

const KeijoTheme = ({ children }: KeijoThemeProps) => {
  const { isDarkMode } = useDarkMode();
  const mode: PaletteMode = isDarkMode ? "dark" : "light";

  const theme = useMemo(() => createTheme(getPalette(mode)), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default KeijoTheme;
