import { Box, AppBar as MuiAppBar, Toolbar } from "@mui/material";
import { useDarkMode } from "usehooks-ts";
import KeijoLogo from "../../common/KeijoLogo";
import ColorModeToggle from "../../theme/ColorModeToggle";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import LanguageSelect from "../language-select/LanguageSelect";
import Title from "./Title";

const AppBar = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <MuiAppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar sx={{ gap: 2 }}>
        <KeijoLogo />
        <Title />
        <Box
          color={isDarkMode ? "primary.light" : "contrastText"}
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
