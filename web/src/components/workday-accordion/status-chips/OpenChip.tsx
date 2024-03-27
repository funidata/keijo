import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTranslation } from "react-i18next";
import StatusChip from "./StatusChip";

const OpenChip = () => {
  const { t } = useTranslation();

  return (
    <StatusChip
      label={t("entryTable.open")}
      icon={<WarningAmberIcon fontSize="small" />}
      color="warning"
    />
  );
};

export default OpenChip;
