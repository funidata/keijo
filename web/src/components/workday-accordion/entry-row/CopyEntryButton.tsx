import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslation } from "react-i18next";
import { Entry } from "../../../graphql/generated/graphql";
import LabelledIconButton from "../../LabelledIconButton";
import { useEntryContext } from "../../workday-browser/entry-context/useEntryContext";

type CopyEntryButtonProps = {
  entry: Entry;
};

const CopyEntryButton = ({ entry }: CopyEntryButtonProps) => {
  const { t } = useTranslation();
  const { selectedEntry, setSelectedEntry } = useEntryContext();

  return (
    <>
      <LabelledIconButton
        label={t("controls.copyEntry")}
        size="medium"
        onClick={(e) => {
          e.stopPropagation();
          selectedEntry?.key !== entry.key ? setSelectedEntry(entry) : setSelectedEntry(null);
        }}
        sx={(theme) => ({
          color:
            theme.palette.mode === "dark"
              ? theme.palette.primary.main
              : theme.palette.secondary.dark,
        })}
      >
        <ContentCopyIcon fontSize="inherit" />
      </LabelledIconButton>
    </>
  );
};

export default CopyEntryButton;
