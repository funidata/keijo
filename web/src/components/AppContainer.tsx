"use client";
import "@fontsource/roboto";
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import ApolloProvider from "../common/ApolloProvider";
import { ChildrenProps } from "../common/types";
import "../i18n";
import LanguageSelect from "./LanguageSelect";

const AppContainer = ({ children }: ChildrenProps) => {
  return (
    <html lang="en">
      <CssBaseline />
      <body>
        <ApolloProvider>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky">
              <Toolbar>
                <Typography variant="h6">Keijo</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                  <LanguageSelect />
                </Box>
              </Toolbar>
            </AppBar>
            <Container>{children}</Container>
          </Box>
        </ApolloProvider>
      </body>
    </html>
  );
};

export default AppContainer;
