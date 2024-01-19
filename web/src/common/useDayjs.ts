import { useTranslation } from "react-i18next";
import dayjs from "./dayjs";

/**
 * Dayjs instance with locale bound to translation library.
 */
const useDayjs = () => {
  const {
    i18n: { language },
  } = useTranslation();

  const locale = language === "fi" ? "fi" : "en-gb";

  dayjs.locale(locale);
  return dayjs;
};

export default useDayjs;
