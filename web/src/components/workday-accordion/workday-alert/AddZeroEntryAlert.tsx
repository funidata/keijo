import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import AddZeroEntryButton from "./AddZeroEntryButton";
import { Dayjs } from "dayjs";

export type AddZeroEntryProps = {
  date: Dayjs;
};

const AddZeroEntryAlert = ({ date }: AddZeroEntryProps) => {
  const { t } = useTranslation();

  return (
    <Alert
      severity="warning"
      action={<AddZeroEntryButton date={date} />}
      sx={{ alignItems: "center" }}
    >
      {`${t("entryTable.zeroEntryAlert")}`}
    </Alert>
  );
};

export default AddZeroEntryAlert;
