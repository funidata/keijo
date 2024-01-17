import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useColorMode from "./useColorMode";

const ColorModeToggle = () => {
  const theme = useTheme();
  const { toggle } = useColorMode();

  return (
    <IconButton sx={{ ml: 1 }} onClick={toggle} size="large" color="inherit">
      {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ColorModeToggle;
