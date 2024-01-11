import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

const EditEntryButton = () => {
  const { t } = useTranslation();

  return (
    <IconButton aria-label={t("controls.editEntry")} color="primary" size="small">
      <EditIcon fontSize="inherit" />
    </IconButton>
  );
};

export default EditEntryButton;
