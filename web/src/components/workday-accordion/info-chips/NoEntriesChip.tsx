import { Chip, SxProps, Theme } from "@mui/material";
import { useTranslation } from "react-i18next";

type NoEntriesChipProps = {
  sx?: SxProps<Theme>;
};

const NoEntriesChip = ({ sx }: NoEntriesChipProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      label={t("entryTable.noEntries")}
      variant="outlined"
      sx={{ color: "inherit", fontStyle: "italic", ...sx }}
    />
  );
};

export default NoEntriesChip;
