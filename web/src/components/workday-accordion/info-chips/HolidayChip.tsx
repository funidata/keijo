import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

const HolidayChip = () => {
  const { t } = useTranslation();

  return (
    <Chip
      label={t("entryTable.holiday")}
      variant="filled"
      sx={{
        color: "inherit",
        fontWeight: 500,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.secondary.dark
            : theme.palette.primary.light,
      }}
    />
  );
};

export default HolidayChip;
