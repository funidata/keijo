import AddCircleIcon from "@mui/icons-material/AddCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  IconPropsSizeOverrides,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useDarkMode from "../../theme/useDarkMode";
import EntryDialog from "../entry-dialog/EntryDialog";

const AppMenuButton = () => {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleEntryDialog = () => {
    setEntryDialogOpen((prev) => !prev);
  };

  const iconProps: IconPropsSizeOverrides = { fontSize: "large" };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <IconButton
        aria-label={t("controls.openMenu")}
        onClick={toggleMenu}
        color="inherit"
        size="large"
      >
        <MenuIcon fontSize="inherit" />
      </IconButton>
      <Drawer open={menuOpen} onClose={toggleMenu} anchor="top">
        <List>
          <ListItem>
            <ListItemButton
              onClick={() => {
                toggleEntryDialog();
                toggleMenu();
              }}
            >
              <ListItemIcon>
                <AddCircleIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: "h5" }}>
                {t("entryDialog.title")}
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem sx={{ mt: 1, mb: 1, ml: 2 }}>
            <ListItemIcon onClick={useDarkMode}>
              {darkMode ? <Brightness7Icon {...iconProps} /> : <Brightness4Icon {...iconProps} />}
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: "h5" }} onClick={toggleDarkMode}>
              {t("controls.useDarkMode")}
            </ListItemText>
            <Switch edge="end" onChange={toggleDarkMode} checked={darkMode} sx={{ mr: 2 }} />
          </ListItem>
        </List>
      </Drawer>
      <EntryDialog open={entryDialogOpen} onClose={toggleEntryDialog} />
    </Box>
  );
};

export default AppMenuButton;
