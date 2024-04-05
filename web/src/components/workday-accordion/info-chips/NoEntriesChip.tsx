import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

const NoEntriesChip = () => {
  const { t } = useTranslation();

  return (
    <Chip
      label={t("entryTable.noEntries")}
      variant="outlined"
      style={{ color: "inherit", fontStyle: "italic" }}
    />
  );
};

export default NoEntriesChip;
