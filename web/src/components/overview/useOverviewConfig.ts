import { useContext } from "react";
import OverviewContext from "./OverviewContextProvider";

export function useOverviewConfig() {
  const context = useContext(OverviewContext);
  if (!context) {
    throw new Error("useOverviewConfig must be used within an OverviewContextProvider");
  }
  return context;
}
