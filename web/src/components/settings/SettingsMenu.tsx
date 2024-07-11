import TuneIcon from "@mui/icons-material/Tune";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { ListItemIcon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { keijoJiraApiUrl } from "../../jira/jiraConfig";
import { axiosKeijo } from "../../jira/axiosInstance";
import { useIsJiraAuthenticated } from "../../jira/jiraApi";

type SettingsMenuProps = {
  anchor: HTMLElement | null;
  onClose: () => void;
};

const SettingsMenu = ({ anchor, onClose }: SettingsMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isJiraAuth } = useIsJiraAuthenticated();

  const handleSetDefaultValues = () => {
    onClose();
    navigate(generatePath(`${location.pathname}/set-defaults`));
  };

  const handleConnectToJira = () => {
    onClose();
    window.location.href = keijoJiraApiUrl;
  };

  const handleDisconnectJira = () => {
    onClose();
    window.location.href = keijoJiraApiUrl + "/remove-session";
  };

  return (
    <Menu
      aria-label={t("controls.settingsMenu")}
      anchorEl={anchor}
      open={!!anchor}
      onClose={onClose}
    >
      <MenuItem onClick={handleSetDefaultValues}>
        <ListItemIcon>
          <TuneIcon />
        </ListItemIcon>
        {t("controls.defaultsView")}
      </MenuItem>
      {isJiraAuth ? (
        <MenuItem onClick={handleDisconnectJira}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          {t("controls.jiraDisconnect")}
        </MenuItem>
      ) : (
        <MenuItem onClick={handleConnectToJira}>
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          {t("controls.jiraConnect")}
        </MenuItem>
      )}
    </Menu>
  );
};

export default SettingsMenu;
