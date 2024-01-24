import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Chip, ChipProps } from "@mui/material";
import { useTranslation } from "react-i18next";

const AcceptedChip = (props: ChipProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      variant="filled"
      sx={{ borderRadius: 1, textTransform: "uppercase", fontWeight: 900 }}
      label={t("entryTable.accepted")}
      icon={<TaskAltIcon fontSize="small" />}
      color="success"
      {...props}
    />
  );
};

export default AcceptedChip;
