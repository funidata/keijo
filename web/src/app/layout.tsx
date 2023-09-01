import "@fontsource/roboto";
import type { Metadata } from "next";
import { ChildrenProps } from "../common/types";
import AppContainer from "../components/AppContainer";

export const metadata: Metadata = {
  title: "Keijo",
  description: "Keijo-työajankirjauskäyttöliittymä",
};

const RootLayout = (props: ChildrenProps) => {
  return <AppContainer {...props} />;
};

export default RootLayout;
