import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconPropsSizeOverrides, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDarkMode from "./useDarkMode";
import { useTranslation } from "react-i18next";

const ColorModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { t } = useTranslation();

  const iconProps: IconPropsSizeOverrides = { fontSize: "inherit" };

  return (
    <Tooltip title={t("controls.useDarkMode")}>
      <IconButton onClick={toggleDarkMode} size="large" color="inherit">
        {darkMode ? <Brightness7Icon {...iconProps} /> : <Brightness4Icon {...iconProps} />}
      </IconButton>
    </Tooltip>
  );
};

export default ColorModeToggle;
