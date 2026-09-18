import { createContext, useContext } from "react";
import { GraphZoneConfig, TimelineGraphVariant, TotalsGraphVariant } from "./graphTypes";
import { Workday } from "../../graphql/generated/graphql";

type OverviewContextType = {
  overviewConfig: GraphZoneConfig[];
  workdays: Workday[];
  handleGraphVariantChange: (
    value: TotalsGraphVariant | TimelineGraphVariant,
    graphIndex: number,
    zoneIndex: number,
  ) => void;
};

export const OverviewContext = createContext<OverviewContextType | null>(null);

export function useOverviewConfig() {
  const context = useContext(OverviewContext);
  if (!context) {
    throw new Error("useOverviewConfig must be used within an OverviewContextProvider");
  }
  return context;
}
