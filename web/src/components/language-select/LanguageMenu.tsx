"use client";
import CheckIcon from "@mui/icons-material/Check";
import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type LanguageMenuProps = {
  anchor: HTMLElement | null;
  onClose: () => void;
};

const LanguageMenu = ({ anchor, onClose }: LanguageMenuProps) => {
  const {
    i18n: { changeLanguage, language },
  } = useTranslation();

  const selectLanguage = (languageCode: string) => {
    changeLanguage(languageCode);
    document.documentElement.lang = languageCode;
    onClose();
  };

  const visibilityFor = (lang: string) => (language === lang ? "visible" : "hidden");

  return (
    <Menu anchorEl={anchor} open={!!anchor} keepMounted onClose={onClose}>
      <MenuItem onClick={() => selectLanguage("fi")}>
        <ListItemIcon>
          <CheckIcon visibility={visibilityFor("fi")} />
        </ListItemIcon>
        <Typography>Suomi</Typography>
      </MenuItem>
      <MenuItem onClick={() => selectLanguage("en")}>
        <ListItemIcon>
          <CheckIcon visibility={visibilityFor("en")} />
        </ListItemIcon>
        English
      </MenuItem>
    </Menu>
  );
};

export default LanguageMenu;
