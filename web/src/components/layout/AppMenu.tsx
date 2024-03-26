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

const AppMenuButton = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <IconButton aria-label="Open app menu." onClick={toggle} color="inherit" size="large">
        <MenuIcon fontSize="inherit" />
      </IconButton>
      <Drawer open={open} onClose={toggle} anchor="top">
        <List>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText>Asd</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default AppMenuButton;
