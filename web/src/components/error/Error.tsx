import { Alert, AlertTitle } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router-dom";
import useDarkMode from "../../theme/useDarkMode";

const Error = () => {
  const { darkMode } = useDarkMode();
  const {
    t,
    i18n: { exists },
  } = useTranslation();
  const error = useRouteError() as object;

  let errorMessage = t("errors.unknownError");

  if ("translationKey" in error && typeof error.translationKey === "string") {
    if (exists(error.translationKey)) {
      errorMessage = t(error.translationKey, {});
    }
  }

  return (
    <Alert color="error" variant={darkMode ? "outlined" : "standard"}>
      <AlertTitle>{t("errors.error")}</AlertTitle>
      {errorMessage}
    </Alert>
  );
};

export default Error;
