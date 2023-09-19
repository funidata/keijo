"use client";
import { Alert, AlertTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

const MissingHeadersAlert = () => {
  const { t } = useTranslation();

  return (
    <Alert severity="error">
      <AlertTitle>{t("errors.error")}</AlertTitle>
      {t("errors.missingEmployeeNumber")}
    </Alert>
  );
};

export default MissingHeadersAlert;
