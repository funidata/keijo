import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

const VacationChip = () => {
  const { t } = useTranslation();

  return (
    <Chip
      label={t("entryTable.vacation")}
      variant="filled"
      sx={{
        color: "black",
        fontWeight: 500,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.secondary.main,
      }}
    />
  );
};

export default VacationChip;
