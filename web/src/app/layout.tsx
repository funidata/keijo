import "@fontsource/roboto";
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Keijo",
  description: "Keijo-työajankirjauskäyttöliittymä",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <CssBaseline />
      <body>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="sticky">
            <Toolbar>
              <Typography variant="h6">Keijo</Typography>
            </Toolbar>
          </AppBar>
          <Container>{children}</Container>
        </Box>
      </body>
    </html>
  );
};

export default RootLayout;
