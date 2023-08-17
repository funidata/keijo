import "@fontsource/roboto";
import { CssBaseline } from "@mui/material";
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
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
