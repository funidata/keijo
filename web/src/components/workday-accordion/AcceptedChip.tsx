import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Chip, ChipProps } from "@mui/material";
import { useTranslation } from "react-i18next";

const AcceptedChip = (props: ChipProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      variant="filled"
      sx={{
        height: "100%",
        borderRadius: 0,
        pl: 1,
        pr: { xs: 3, md: 0 },
        textTransform: "uppercase",
        fontWeight: 900,
        ".MuiChip-label": { display: { xs: "none", md: "block" } },
      }}
      label={t("entryTable.accepted")}
      icon={<TaskAltIcon fontSize="small" />}
      color="success"
      {...props}
    />
  );
};

export default AcceptedChip;
