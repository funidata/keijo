"use client";
import "@fontsource/roboto";
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ApolloProvider from "../common/ApolloProvider";
import { ChildrenProps } from "../common/types";
import "../i18n";
import LanguageSelect from "./LanguageSelect";

const AppContainer = ({ children }: ChildrenProps) => {
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    // Set initial HTML lang value.
    document.documentElement.lang = language;
  }, []);

  return (
    <html>
      <CssBaseline />
      <body>
        <ApolloProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="sticky">
                <Toolbar>
                  <Typography variant="h6">Keijo</Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box>
                    <LanguageSelect />
                  </Box>
                </Toolbar>
              </AppBar>
              <Container>{children}</Container>
            </Box>
          </LocalizationProvider>
        </ApolloProvider>
      </body>
    </html>
  );
};

export default AppContainer;
