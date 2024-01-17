import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import { useDarkMode } from "usehooks-ts";

const ColorModeToggle = () => {
  const { toggle, isDarkMode } = useDarkMode();

  return (
    <IconButton sx={{ ml: 1 }} onClick={toggle} size="large" color="inherit">
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ColorModeToggle;
