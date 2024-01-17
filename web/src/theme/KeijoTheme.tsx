import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactNode, useMemo } from "react";

type KeijoThemeProps = {
  children: ReactNode;
};

const KeijoTheme = ({ children }: KeijoThemeProps) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default KeijoTheme;
