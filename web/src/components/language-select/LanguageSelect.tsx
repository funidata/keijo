import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import LabelledIconButton from "../LabelledIconButton";
import LanguageMenu from "./LanguageMenu";

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
      <LabelledIconButton label={t("controls.selectLanguage")} onClick={openMenu}>
        <FlagCircleIcon fontSize="inherit" />
      </LabelledIconButton>
      <LanguageMenu anchor={menuAnchor} onClose={closeMenu} />
    </>
  );
};

export default LanguageSelect;
