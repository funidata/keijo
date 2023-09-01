"use client";
import "@fontsource/roboto";
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import Apollo from "../common/apollo";
import "./i18n";
import { ChildrenProps } from "./types";

const AppContainer = ({ children }: ChildrenProps) => {
  return (
    <html lang="en">
      <CssBaseline />
      <body>
        <Apollo>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky">
              <Toolbar>
                <Typography variant="h6">Keijo</Typography>
              </Toolbar>
            </AppBar>
            <Container>{children}</Container>
          </Box>
        </Apollo>
      </body>
    </html>
  );
};

export default AppContainer;
