import SaveAsIcon from "@mui/icons-material/SaveAs";
import { Box, IconButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import LabelledIconButton from "../LabelledIconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { Dayjs } from "dayjs";
import { useEntryContext } from "../workday-browser/entry-context/useEntryContext";

type PasteEntryButtonProps = { date: Dayjs } & IconButtonProps;

const PasteEditEntryButton = ({ date, ...props }: PasteEntryButtonProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedEntries, clearEntries } = useEntryContext();

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <LabelledIconButton
        size="medium"
        label={t("controls.pasteAndEditEntry")}
        onClick={() => {
          const templateEntries = selectedEntries;
          clearEntries();
          navigate(`${location.pathname}/create`, {
            state: { date: date.format("YYYY-MM-DD"), templateEntries },
          });
        }}
        {...props}
      >
        <SaveAsIcon fontSize="inherit" />
      </LabelledIconButton>
    </Box>
  );
};

export default PasteEditEntryButton;
