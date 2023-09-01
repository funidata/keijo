import "@fontsource/roboto";
import type { Metadata } from "next";
import AppContainer from "../common/app-container";
import { ChildrenProps } from "../common/types";

export const metadata: Metadata = {
  title: "Keijo",
  description: "Keijo-työajankirjauskäyttöliittymä",
};

const RootLayout = (props: ChildrenProps) => {
  return <AppContainer {...props} />;
};

export default RootLayout;
