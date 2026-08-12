import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ToggleButton from "@mui/material/ToggleButton";
import { useTranslation } from "react-i18next";
import { EntryTemplateType } from "../../../graphql/generated/graphql";
import { useEntryContext } from "../../workday-browser/entry-context/useEntryContext";
import { useCallback } from "react";

type CopyEntryButtonProps = {
  entry: EntryTemplateType;
};

const CopyEntryButton = ({ entry }: CopyEntryButtonProps) => {
  const { t } = useTranslation();
  const { hasEntry, addSelectedEntry, removeSelectedEntry } = useEntryContext();
  const entryButtonClickHandler = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();

      if (hasEntry(entry)) {
        removeSelectedEntry(entry);
      } else {
        addSelectedEntry(entry);
      }
    },
    [entry, hasEntry, addSelectedEntry, removeSelectedEntry],
  );
  return (
    <ToggleButton
      value={t("controls.copyEntry")}
      aria-label={t("controls.copyEntry")}
      size="medium"
      onClick={entryButtonClickHandler}
      sx={{
        border: "none",
        borderRadius: "50%",
        color: "secondary.dark",
      }}
      selected={hasEntry(entry)}
    >
      <ContentCopyIcon />
    </ToggleButton>
  );
};

export default CopyEntryButton;
