import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import GlobalNotification from "./components/global-notification/GlobalNotification";
import LocalizationProvider from "./i18n/LocalizationProvider";
import "./i18n/i18n-config";
import { useRecentJiraIssues } from "./jira/useRecentJiraIssues";
import router from "./router";
import KeijoTheme from "./theme/KeijoTheme";

const Keijo = () => {
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    // Set initial HTML lang value.
    document.documentElement.lang = language;
  }, []);

  // Preload issues from Jira.
  useRecentJiraIssues();

  return (
    <KeijoTheme>
      <CssBaseline />
      <GlobalNotification />
      <LocalizationProvider>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </KeijoTheme>
  );
};

export default Keijo;
