import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import { Box, IconButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import LabelledIconButton from "../LabelledIconButton";

type PasteEntryButtonProps = IconButtonProps;

const PasteEntryButton = ({ ...props }: PasteEntryButtonProps) => {
  const { t } = useTranslation();

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <LabelledIconButton size="medium" label={t("controls.pasteEntry")} {...props}>
        <ContentPasteGoIcon fontSize="inherit" />
      </LabelledIconButton>
    </Box>
  );
};

export default PasteEntryButton;
