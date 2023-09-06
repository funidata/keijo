"use client";
import "@fontsource/roboto";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ApolloProvider from "../common/ApolloProvider";
import { ChildrenProps } from "../common/types";
import "../i18n";
import AppBar from "./AppBar";

const AppContainer = ({ children }: ChildrenProps) => {
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    // Set initial HTML lang value.
    document.documentElement.lang = language;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html>
      <CssBaseline />
      <body>
        <ApolloProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AppBar>{children}</AppBar>
          </LocalizationProvider>
        </ApolloProvider>
      </body>
    </html>
  );
};

export default AppContainer;
