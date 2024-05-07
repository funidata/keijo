import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import ZeroEntryButton from "./ZeroEntryButton";
import { Dayjs } from "dayjs";

export type ZeroEntryProps = {
  date: Dayjs;
};

const ZeroEntryAlert = ({ date }: ZeroEntryProps) => {
  const { t } = useTranslation();

  return (
    <Alert severity="warning" action={<ZeroEntryButton date={date} />}>
      {`${t("entryTable.zeroEntryAlert")}`}
    </Alert>
  );
};

export default ZeroEntryAlert;
