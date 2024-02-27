import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconPropsSizeOverrides } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDarkModeDisabled from "./useDarkModeDisabled";

const ColorModeToggle = () => {
  const { toggle, isDarkMode } = useDarkModeDisabled();

  const iconProps: IconPropsSizeOverrides = { fontSize: "inherit" };

  return (
    <IconButton onClick={toggle} size="large" color="inherit">
      {isDarkMode ? <Brightness7Icon {...iconProps} /> : <Brightness4Icon {...iconProps} />}
    </IconButton>
  );
};

export default ColorModeToggle;
