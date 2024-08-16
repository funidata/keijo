import { useTranslation } from "react-i18next";
import BigDialog from "../BigDialog";
import EntryForm from "../entry-form/EntryForm";

type EntryDialogProps = {
  variant: "create" | "edit";
};

const EntryDialog = ({ variant }: EntryDialogProps) => {
  const { t } = useTranslation();

  const titleKey = variant === "create" ? "entryDialog.title.create" : "entryDialog.title.edit";

  return (
    <BigDialog title={t(titleKey)}>
      <EntryForm />
    </BigDialog>
  );
};

EntryDialog.defaultProps = {
  variant: "create",
};

export default EntryDialog;
