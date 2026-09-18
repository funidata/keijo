import { useTranslation } from "react-i18next";
import BigDialog from "../BigDialog";
import TemplateForm from "./TemplateForm";

type TemplateDialogProps = {
  variant?: "create" | "edit";
};

const TemplateDialog = ({ variant = "create" }: TemplateDialogProps) => {
  const { t } = useTranslation();

  const titleKey = variant === "create" ? "controls.addTemplate" : "controls.editEntryTemplate";
  return (
    <BigDialog title={t(titleKey)}>
      <TemplateForm />
    </BigDialog>
  );
};

export default TemplateDialog;
