import TuneIcon from "@mui/icons-material/Tune";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { ListItemIcon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { useIsJiraAuthenticated } from "../../jira/jiraApi";
import { disconnectJira } from "../../jira/jiraUtils";
import { JiraInfoDialog } from "../../jira/components/JiraInfoDialog";
import { useState } from "react";

type SettingsMenuProps = {
  anchor: HTMLElement | null;
  onClose: () => void;
};

const SettingsMenu = ({ anchor, onClose }: SettingsMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isJiraAuth } = useIsJiraAuthenticated();
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const handleSetDefaultValues = () => {
    onClose();
    navigate(generatePath(`${location.pathname}/set-defaults`));
  };

  const handleConnectToJira = () => {
    setInfoDialogOpen(true);
  };

  const handleDisconnectJira = () => {
    onClose();
    disconnectJira();
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
      <JiraInfoDialog open={infoDialogOpen} handleClose={() => setInfoDialogOpen(false)} />
    </Menu>
  );
};

export default SettingsMenu;
