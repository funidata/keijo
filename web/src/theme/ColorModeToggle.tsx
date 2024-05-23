import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconPropsSizeOverrides } from "@mui/material";
import { useTranslation } from "react-i18next";
import LabelledIconButton from "../components/LabelledIconButton";
import useDarkMode from "./useDarkMode";

const ColorModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { t } = useTranslation();

  const iconProps: IconPropsSizeOverrides = { fontSize: "inherit" };

  return (
    <LabelledIconButton label={t("controls.useDarkMode")} onClick={toggleDarkMode}>
      {darkMode ? <Brightness7Icon {...iconProps} /> : <Brightness4Icon {...iconProps} />}
    </LabelledIconButton>
  );
};

export default ColorModeToggle;
