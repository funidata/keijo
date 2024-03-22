import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconPropsSizeOverrides } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDarkMode from "./useDarkMode";

const ColorModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const iconProps: IconPropsSizeOverrides = { fontSize: "inherit" };

  return (
    <IconButton onClick={toggleDarkMode} size="large" color="inherit">
      {darkMode ? <Brightness7Icon {...iconProps} /> : <Brightness4Icon {...iconProps} />}
    </IconButton>
  );
};

export default ColorModeToggle;
