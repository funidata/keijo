import AddCircleIcon from "@mui/icons-material/AddCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CheckIcon from "@mui/icons-material/Check";
import MenuIcon from "@mui/icons-material/Menu";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Box,
  Divider,
  Drawer,
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
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "../../theme/useDarkMode";
import LabelledIconButton from "../LabelledIconButton";

const AppMenuButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const selectLanguage = (languageCode: string) => {
    changeLanguage(languageCode);
    document.documentElement.lang = languageCode;
  };

  const visibilityFor = (lang: string) => (language === lang ? "visible" : "hidden");

  const iconProps: IconPropsSizeOverrides = { fontSize: "large" };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <LabelledIconButton label={t("controls.openMenu")} onClick={toggleMenu}>
        <MenuIcon fontSize="inherit" />
      </LabelledIconButton>
      <Drawer open={menuOpen} onClose={toggleMenu} anchor="top">
        <List>
          <ListItem>
            <ListItemButton
              onClick={() => {
                navigate(`${location.pathname}/create`, { state: { date: undefined } });
                toggleMenu();
              }}
            >
              <ListItemIcon>
                <AddCircleIcon {...iconProps} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: "h5" }}>
                {t("controls.addEntry")}
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton
              onClick={() => {
                navigate(generatePath(`${location.pathname}/set-defaults`));
                toggleMenu();
              }}
            >
              <ListItemIcon>
                <TuneIcon {...iconProps} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: "h5" }}>
                {t("controls.defaultsView")}
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
          <Divider />
          <ListItem>
            <ListItemButton onClick={() => selectLanguage("fi")}>
              <ListItemIcon>
                <CheckIcon {...iconProps} visibility={visibilityFor("fi")} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: "h5" }}>Suomi</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => selectLanguage("en")}>
              <ListItemIcon>
                <CheckIcon {...iconProps} visibility={visibilityFor("en")} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: "h5" }}>English</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default AppMenuButton;
