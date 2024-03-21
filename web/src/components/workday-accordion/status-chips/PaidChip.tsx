import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { useTranslation } from "react-i18next";
import StatusChip from "./StatusChip";

const PaidChip = () => {
  const { t } = useTranslation();

  return (
    <StatusChip
      label={t("entryTable.paid")}
      icon={<PaidOutlinedIcon fontSize="small" />}
      color="info"
    />
  );
};

export default PaidChip;
