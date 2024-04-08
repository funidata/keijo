import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useTranslation } from "react-i18next";
import StatusChip from "./StatusChip";

const AcceptedChip = () => {
  const { t } = useTranslation();

  return (
    <StatusChip
      label={t("entryTable.accepted")}
      icon={<TaskAltIcon fontSize="small" />}
      color="success"
    />
  );
};

export default AcceptedChip;
