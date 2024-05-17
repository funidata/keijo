import { Box, AppBar as MuiAppBar, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import KeijoLogo from "../../common/KeijoLogo";
import ColorModeToggle from "../../theme/ColorModeToggle";
import useDarkMode from "../../theme/useDarkMode";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import LanguageSelect from "../language-select/LanguageSelect";
import AppMenuButton from "./AppMenu";
import Title from "./Title";
import SettingsSelect from "../settings/SettingsSelect";

const AppBar = () => {
  const { darkMode } = useDarkMode();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <MuiAppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar sx={{ gap: 2 }}>
        <KeijoLogo />
        <Title />
        <Box
          color={darkMode ? "primary.light" : "contrastText"}
          sx={{ display: "flex", flexWrap: "nowrap" }}
        >
          {mobile ? (
            <AppMenuButton />
          ) : (
            <>
              <EntryDialogButton />
              <ColorModeToggle />
              <LanguageSelect />
              <SettingsSelect />
            </>
          )}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
