import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home";
import AppContainer from "./components/AppContainer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContainer>
      <Home />
    </AppContainer>
  </React.StrictMode>,
);
