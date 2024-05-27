import { useTranslation } from "react-i18next";
import BigDialog from "../BigDialog";
import DefaultsForm from "./DefaultsForm";

const DefaultsDialog = () => {
  const { t } = useTranslation();

  return (
    <BigDialog title={t("entryDialog.setDefaultsTitle")}>
      <DefaultsForm />
    </BigDialog>
  );
};

export default DefaultsDialog;
