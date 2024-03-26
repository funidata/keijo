import { Box, AppBar as MuiAppBar, Toolbar } from "@mui/material";
import KeijoLogo from "../../common/KeijoLogo";
import ColorModeToggle from "../../theme/ColorModeToggle";
import useDarkMode from "../../theme/useDarkMode";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import LanguageSelect from "../language-select/LanguageSelect";
import Title from "./Title";

const AppBar = () => {
  const { darkMode } = useDarkMode();

  return (
    <MuiAppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar sx={{ gap: 2 }}>
        <KeijoLogo />
        <Title />
        <Box
          color={darkMode ? "primary.light" : "contrastText"}
          sx={{ display: "flex", flexWrap: "nowrap" }}
        >
          <EntryDialogButton />
          {process.env.NODE_ENV === "development" && <ColorModeToggle />}
          <LanguageSelect />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
