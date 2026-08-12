import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { generatePath, useLocation, useNavigate } from "react-router-dom";

const CreateTemplateButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        navigate(generatePath(`${location.pathname}/create-template`));
      }}
      startIcon={<AddIcon />}
      size="large"
      variant="outlined"
      sx={{
        border: "2px dashed",
        borderColor: "secondary.main",
        paddingY: 2,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {t("controls.addTemplate")}
    </Button>
  );
};

export default CreateTemplateButton;
