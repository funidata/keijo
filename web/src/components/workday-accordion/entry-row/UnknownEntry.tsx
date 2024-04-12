import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { EntryRowProps } from "./EntryRow";

const UnknownEntry = ({ entry }: EntryRowProps) => {
  const { t } = useTranslation();

  return (
    <Alert severity="info">
      {`${t("entryTable.unknownEntry")}: `}
      <i>{entry.typeName}</i>
      {entry.description && (
        <>
          <br />
          {`${t("entryDialog.description")}: `}
          <i>{entry.description}</i>
        </>
      )}
    </Alert>
  );
};

export default UnknownEntry;
