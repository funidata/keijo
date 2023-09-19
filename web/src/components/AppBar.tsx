"use client";
import "@fontsource/roboto";
import { Box, Container, AppBar as MuiAppBar, Toolbar, Typography } from "@mui/material";
import { ChildrenProps } from "../common/types";
import "../i18n";
import EntryDialogButton from "./EntryDialog/EntryDialogButton";
import LanguageSelect from "./LanguageSelect";

const AppBar = ({ children }: ChildrenProps) => (
  <Box sx={{ flexGrow: 1 }}>
    <MuiAppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6">Keijo</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <EntryDialogButton />
          <LanguageSelect />
        </Box>
      </Toolbar>
    </MuiAppBar>
    <Container>{children}</Container>
  </Box>
);

export default AppBar;
