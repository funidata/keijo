import { ApolloProvider } from "@apollo/client";
import { LicenseInfo } from "@mui/x-license";
import React from "react";
import ReactDOM from "react-dom/client";
import Keijo from "./Keijo";
import { apolloClient } from "./common/apolloClient";
import "./common/session";
import { queryClient } from "./jira/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_X_LICENSE);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <Keijo />
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
