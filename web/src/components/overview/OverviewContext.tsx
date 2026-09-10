import { useContext, useMemo, createContext, PropsWithChildren } from "react";
import { GraphZoneConfig } from "./graphTypes";
import type { Workday } from "../../graphql/generated/graphql";
import { DEFAULT_OVERVIEW_CONFIG, OVERVIEW_CONFIG_LOCALSTORAGE_KEY } from "./constants";
import { useLocalStorage } from "usehooks-ts";

type OverviewContextType = {
  overviewConfig: GraphZoneConfig[];
  workdays: Workday[];
};

const OverviewContext = createContext<OverviewContextType | null>(null);

export default function OverviewContextProvider({
  children,
  workdays,
}: PropsWithChildren<{ workdays: Workday[] }>) {
  const [overviewConfig] = useLocalStorage(
    OVERVIEW_CONFIG_LOCALSTORAGE_KEY,
    DEFAULT_OVERVIEW_CONFIG,
  );

  const contextValue = useMemo(() => {
    return {
      overviewConfig,
      workdays,
    };
  }, [overviewConfig, workdays]);

  return <OverviewContext.Provider value={contextValue}>{children}</OverviewContext.Provider>;
}

export function useOverviewConfig() {
  const context = useContext(OverviewContext);
  if (!context) {
    throw new Error("useOverviewConfig must be used within an OverviewContextProvider");
  }
  return context;
}
