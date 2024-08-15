import AddIcon from "@mui/icons-material/Add";
import { Box, IconButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import LabelledIconButton from "../LabelledIconButton";

type CreateTemplateButtonProps = IconButtonProps;

const CreateTemplateButton = ({ ...props }: CreateTemplateButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <LabelledIconButton
        label={t("controls.addTemplate")}
        onClick={() => navigate(generatePath(`${location.pathname}/create-template`))}
        {...props}
      >
        <AddIcon fontSize="inherit" />
      </LabelledIconButton>
    </Box>
  );
};

export default CreateTemplateButton;
