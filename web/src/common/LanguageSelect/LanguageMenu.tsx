"use client";
import { Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

type LanguageMenuProps = {
  anchor: HTMLElement | null;
  onClose: () => void;
};

const LanguageMenu = ({ anchor, onClose }: LanguageMenuProps) => {
  const {
    i18n: { changeLanguage },
  } = useTranslation();

  const selectLanguage = (languageCode: string) => {
    changeLanguage(languageCode);
    onClose();
  };

  return (
    <Menu anchorEl={anchor} open={!!anchor} keepMounted onClose={onClose}>
      <MenuItem onClick={() => selectLanguage("fi")}>Suomi</MenuItem>
      <MenuItem onClick={() => selectLanguage("en")}>English</MenuItem>
    </Menu>
  );
};

export default LanguageMenu;
