import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";

const DeleteEntryButton = () => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<Element | null>(null);

  const onOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.target as Element);
  };

  const onClose = () => {
    setAnchor(null);
  };

  const onConfirm = async () => {
    console.log("delete");
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label={t("controls.deleteEntry")}
        onClick={onOpen}
        color="error"
        size="small"
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      <Menu open={!!anchor} anchorEl={anchor} onClose={onClose}>
        <MenuItem onClick={onConfirm}>{t("controls.confirm")}</MenuItem>
      </Menu>
    </>
  );
};

export default DeleteEntryButton;
