import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { EntryTemplateType } from "../../../graphql/generated/graphql";
import { useEntryContext } from "../../workday-browser/entry-context/useEntryContext";
import { useCallback, useMemo } from "react";

type CopyEntryButtonProps = {
  entry: EntryTemplateType;
};

const CopyEntryButton = ({ entry }: CopyEntryButtonProps) => {
  const { t } = useTranslation();
  const { hasEntry, addSelectedEntry, removeSelectedEntry } = useEntryContext();

  const isSelected = useMemo(() => {
    return hasEntry(entry);
  }, [entry, hasEntry]);
  const buttonText = useMemo(() => {
    if (isSelected) {
      return t("controls.deselectEntryTemplate");
    }
    return t("controls.selectEntryTemplate");
  }, [isSelected, t]);

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
    <Tooltip title={buttonText}>
      <ToggleButton
        value={t("controls.selectEntryTemplate")}
        aria-label={buttonText}
        size="large"
        onClick={entryButtonClickHandler}
        sx={(theme) => ({
          border: "none",
          color: theme.palette.mode === "light" ? "secondary.dark" : "primary",
        })}
        selected={isSelected}
      >
        <ContentCopyIcon />
      </ToggleButton>
    </Tooltip>
  );
};

export default CopyEntryButton;
