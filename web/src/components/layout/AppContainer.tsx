import { ApolloProvider } from "@apollo/client";
import "@fontsource/roboto";
import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { apolloClient } from "../../common/ApolloProvider";
import { ChildrenProps } from "../../common/types";
import LocalizationProvider from "../../i18n/LocalizationProvider";
import "../../i18n/i18n-config";
import KeijoTheme from "../../theme/KeijoTheme";
import GlobalNotification from "../global-notification/GlobalNotification";
import AppBar from "./AppBar";
import ContentContainer from "./ContentContainer";

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
    <KeijoTheme>
      <CssBaseline />
      <GlobalNotification />
      <ApolloProvider client={apolloClient}>
        <LocalizationProvider>
          <AppBar />
          <ContentContainer>{children}</ContentContainer>
        </LocalizationProvider>
      </ApolloProvider>
    </KeijoTheme>
  );
};

export default AppContainer;
