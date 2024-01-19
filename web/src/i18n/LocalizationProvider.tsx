import { LocalizationProvider as MuiLocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "../common/dayjs";

type LocalizationProviderProps = {
  children: ReactNode;
};

const LocalizationProvider = ({ children }: LocalizationProviderProps) => {
  const {
    i18n: { language },
  } = useTranslation();
  const adapterLocale = language === "fi" ? "fi" : "en-gb";

  return (
    <MuiLocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
      dateLibInstance={dayjs}
    >
      {children}
    </MuiLocalizationProvider>
  );
};

export default LocalizationProvider;
