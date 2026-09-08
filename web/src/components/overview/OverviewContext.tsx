import { useContext, useMemo, createContext, PropsWithChildren, useCallback } from "react";
import { GraphZoneConfig } from "./graphTypes";
import type { TotalsGraphVariant, TimelineGraphVariant } from "./graphTypes";
import type { Workday } from "../../graphql/generated/graphql";
import { DEFAULT_OVERVIEW_CONFIG, OVERVIEW_CONFIG_LOCALSTORAGE_KEY } from "./constants";
import { useLocalStorage } from "usehooks-ts";

type OverviewContextType = {
  overviewConfig: GraphZoneConfig[];
  workdays: Workday[];
  handleGraphVariantChange: (
    value: TotalsGraphVariant | TimelineGraphVariant,
    graphIndex: number,
    zoneIndex: number,
  ) => void;
  updateOverviewConfig: (newConfig: GraphZoneConfig[]) => void;
};

const OverviewContext = createContext<OverviewContextType | null>(null);

export default function OverviewContextProvider({
  children,
  workdays,
}: PropsWithChildren<{ workdays: Workday[] }>) {
  const [overviewConfig, setOverviewConfig] = useLocalStorage(
    OVERVIEW_CONFIG_LOCALSTORAGE_KEY,
    DEFAULT_OVERVIEW_CONFIG,
  );

  const updateOverviewConfig = useCallback((newConfig: GraphZoneConfig[]) => {
    setOverviewConfig(newConfig);
    localStorage.setItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY, JSON.stringify(newConfig));
  }, []);

  const handleGraphVariantChange = useCallback(
    (value: TotalsGraphVariant | TimelineGraphVariant, graphIndex: number, zoneIndex: number) => {
      const newConfig = [...overviewConfig];
      newConfig[zoneIndex].graphs[graphIndex].variant = value;

      updateOverviewConfig(newConfig);
    },
    [overviewConfig, updateOverviewConfig],
  );

  const contextValue = useMemo(() => {
    return {
      overviewConfig,
      workdays,
      handleGraphVariantChange,
      updateOverviewConfig,
    };
  }, [overviewConfig, workdays, handleGraphVariantChange, updateOverviewConfig]);

  return <OverviewContext.Provider value={contextValue}>{children}</OverviewContext.Provider>;
}

export function useOverviewConfig() {
  const context = useContext(OverviewContext);
  if (!context) {
    throw new Error("useOverviewConfig must be used within an OverviewContextProvider");
  }
  return context;
}
