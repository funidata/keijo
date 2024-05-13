import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import { IconButton, Tooltip } from "@mui/material";
import { MouseEvent, useState } from "react";
import LanguageMenu from "./LanguageMenu";
import { useTranslation } from "react-i18next";

const LanguageSelect = () => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <Tooltip title={t("controls.selectLanguage")}>
        <IconButton
          aria-label={t("controls.selectLanguage")}
          size="large"
          color="inherit"
          onClick={openMenu}
        >
          <FlagCircleIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <LanguageMenu anchor={menuAnchor} onClose={closeMenu} />
    </>
  );
};

export default LanguageSelect;
