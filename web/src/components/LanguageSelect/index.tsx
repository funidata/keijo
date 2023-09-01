"use client";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import { IconButton } from "@mui/material";
import { MouseEvent, useState } from "react";
import LanguageMenu from "./LanguageMenu";

const LanguageSelect = () => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <IconButton size="large" color="inherit" onClick={openMenu}>
        <FlagCircleIcon fontSize="inherit" />
      </IconButton>

      <LanguageMenu anchor={menuAnchor} onClose={closeMenu} />
    </>
  );
};

export default LanguageSelect;
