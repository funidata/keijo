import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ToggleButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { EntryTemplateType } from "../../../graphql/generated/graphql";
import { useEntryContext } from "../../workday-browser/entry-context/useEntryContext";

type CopyEntryButtonProps = {
  entry: EntryTemplateType;
};

const CopyEntryButton = ({ entry }: CopyEntryButtonProps) => {
  const { t } = useTranslation();
  const { hasEntry, addSelectedEntry, removeSelectedEntry } = useEntryContext();

  return (
    <>
      <Tooltip title={t("controls.copyEntry")} arrow placement="bottom">
        <ToggleButton
          value={t("controls.copyEntry")}
          aria-label={t("controls.copyEntry")}
          size="medium"
          onClick={(e) => {
            e.stopPropagation();
            !hasEntry(entry) ? addSelectedEntry(entry) : removeSelectedEntry(entry);
          }}
          sx={(theme) => ({
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.main
                : theme.palette.secondary.dark,
            border: "none",
            borderRadius: "50%",
          })}
          selected={hasEntry(entry)}
        >
          <ContentCopyIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
    </>
  );
};

export default CopyEntryButton;
