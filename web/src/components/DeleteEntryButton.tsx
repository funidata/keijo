import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DeleteEntryButton = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <IconButton
        aria-label={t("controls.deleteEntry")}
        onClick={toggle}
        color="error"
        size="small"
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </>
  );
};

export default DeleteEntryButton;
