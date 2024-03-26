import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EntryDialog from "../entry-dialog/EntryDialog";

const AppMenuButton = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleEntryDialog = () => {
    setEntryDialogOpen((prev) => !prev);
  };

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
        </List>
      </Drawer>
      <EntryDialog open={entryDialogOpen} onClose={toggleEntryDialog} />
    </Box>
  );
};

export default AppMenuButton;
