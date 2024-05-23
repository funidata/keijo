import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import LabelledIconButton from "../LabelledIconButton";
import SettingsMenu from "./SettingsMenu";

const SettingsSelect = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <LabelledIconButton label={t("controls.settingsMenu")} onClick={handleClick}>
        <MoreVertIcon />
      </LabelledIconButton>
      <SettingsMenu anchor={anchorEl} onClose={handleClose} />
    </>
  );
};

export default SettingsSelect;
