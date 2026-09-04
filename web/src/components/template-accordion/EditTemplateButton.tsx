import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { EntryTemplateType } from "../../graphql/generated/graphql";

type EditTemplateButtonProps = {
  template: EntryTemplateType;
};

const EditTemplateButton = ({ template }: EditTemplateButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <IconButton
      aria-label={t("controls.editEntryTemplate")}
      onClick={(e) => {
        e.stopPropagation();
        navigate(generatePath(`${location.pathname}/edit-template`), {
          state: { editTemplate: template },
        });
      }}
      size="medium"
    >
      <EditIcon />
    </IconButton>
  );
};

export default EditTemplateButton;
