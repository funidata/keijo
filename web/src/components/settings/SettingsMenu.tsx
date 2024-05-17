import TuneIcon from "@mui/icons-material/Tune";
import { ListItemIcon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import { generatePath, useLocation, useNavigate } from "react-router-dom";

type SettingsMenuProps = {
  anchor: HTMLElement | null;
  onClose: () => void;
};

const SettingsMenu = ({ anchor, onClose }: SettingsMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSetDefaultValues = () => {
    onClose();
    navigate(generatePath(`${location.pathname}/set-defaults`));
  };

  return (
    <Menu
      aria-label={t("controls.settingsMenu")}
      anchorEl={anchor}
      open={!!anchor}
      onClose={onClose}
    >
      <MenuItem key={t("entryDialog.setDefaultsTitle")} onClick={handleSetDefaultValues}>
        <ListItemIcon>
          <TuneIcon />
        </ListItemIcon>
        {t("entryDialog.setDefaultsTitle")}
      </MenuItem>
    </Menu>
  );
};

export default SettingsMenu;
