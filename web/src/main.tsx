import { LicenseInfo } from "@mui/x-date-pickers-pro";
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home";
import AppContainer from "./components/layout/AppContainer";

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_X_LICENSE);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContainer>
      <Home />
    </AppContainer>
  </React.StrictMode>,
);
