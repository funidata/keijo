import "@fontsource/roboto";
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Apollo from "../common/apollo";

export const metadata: Metadata = {
  title: "Keijo",
  description: "Keijo-työajankirjauskäyttöliittymä",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
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

export default RootLayout;
