import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import SettingsMenu from "./SettingsMenu";

const SettingsSelect = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={t("controls.settingsMenu")}>
        <IconButton aria-label={t("controls.settingsMenu")} size="large" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <SettingsMenu anchor={anchorEl} onClose={handleClose} />
    </>
  );
};

export default SettingsSelect;
