import "@fontsource/roboto";
import { Box, AppBar as MuiAppBar, Toolbar, Typography } from "@mui/material";
import { useDarkMode } from "usehooks-ts";
import ColorModeToggle from "../../theme/ColorModeToggle";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import LanguageSelect from "../language-select/LanguageSelect";

const AppBar = () => {
  const { isDarkMode } = useDarkMode();
  console.log(isDarkMode);

  return (
    <MuiAppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6">Keijo</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box color={isDarkMode ? "primary.light" : "contrastText"}>
          <EntryDialogButton />
          <ColorModeToggle />
          <LanguageSelect />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
