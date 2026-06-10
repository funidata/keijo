import { useTranslation } from "react-i18next";
import BigDialog from "../BigDialog";
import EntryForm from "./EntryForm";

type EntryDialogProps = {
  variant?: "create" | "edit";
};

const EntryDialog = ({ variant = "create" }: EntryDialogProps) => {
  const { t } = useTranslation();

  const titleKey = variant === "create" ? "entryDialog.title.create" : "entryDialog.title.edit";

  return (
    <BigDialog title={t(titleKey)}>
      <EntryForm />
    </BigDialog>
  );
};

export default EntryDialog;
