import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import { Box, IconButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import LabelledIconButton from "../LabelledIconButton";
import { useEntryContext } from "../workday-browser/entry-context/useEntryContext";

type PasteEntryButtonProps = IconButtonProps;

const PasteEntryButton = ({ ...props }: PasteEntryButtonProps) => {
  const { t } = useTranslation();
  const { selectedEntries } = useEntryContext();

  return (
    <Box onClick={(e) => e.stopPropagation()} sx={{ color: "secondary.dark" }}>
      <LabelledIconButton
        size="medium"
        label={t("controls.pasteEntry", { count: selectedEntries.length })}
        {...props}
      >
        <ContentPasteGoIcon fontSize="inherit" />
      </LabelledIconButton>
    </Box>
  );
};

export default PasteEntryButton;
