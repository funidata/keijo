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
  const { selectedEntries, setEditDate, hasEntries, removeSelectedEntry } = useEntryContext();

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <LabelledIconButton
        size="medium"
        label={t("controls.pasteAndEditEntry")}
        onClick={() => {
          setEditDate(date);
          const entry = selectedEntries[0];
          if (hasEntries) {
            removeSelectedEntry(entry);
          }
          navigate(`${location.pathname}/create`, {
            state: { date: date.format("YYYY-MM-DD"), template: entry },
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
