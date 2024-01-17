import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactNode, useEffect, useMemo } from "react";
import useColorMode from "./useColorMode";

type KeijoThemeProps = {
  children: ReactNode;
};

const KeijoTheme = ({ children }: KeijoThemeProps) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { mode, setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode, setColorMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default KeijoTheme;
