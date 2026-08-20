import { useTranslation } from "react-i18next";
import BigDialog from "../BigDialog";
import TemplateForm from "./TemplateForm";

const TemplateDialog = () => {
  const { t } = useTranslation();

  return (
    <BigDialog title={t("controls.addTemplate")}>
      <TemplateForm />
    </BigDialog>
  );
};

export default TemplateDialog;
