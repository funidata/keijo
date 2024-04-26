import { ApolloProvider } from "@apollo/client";
import { LicenseInfo } from "@mui/x-license";
import React from "react";
import ReactDOM from "react-dom/client";
import Keijo from "./Keijo";
import { apolloClient } from "./common/ApolloProvider";
import "./common/session";

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_X_LICENSE);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Keijo />
    </ApolloProvider>
  </React.StrictMode>,
);
