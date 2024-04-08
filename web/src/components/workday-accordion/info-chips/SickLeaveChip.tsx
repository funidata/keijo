import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

const SickLeaveChip = () => {
  const { t } = useTranslation();

  return (
    <Chip
      label={t("entryTable.sickLeave")}
      variant="filled"
      sx={{
        color: "black",
        fontWeight: 500,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.secondary.main
            : theme.palette.secondary.main,
      }}
    />
  );
};

export default SickLeaveChip;
