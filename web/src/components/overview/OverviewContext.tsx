import { useMutation, useQuery } from "@apollo/client/react";
import { useContext, useMemo, createContext, PropsWithChildren, useCallback } from "react";
import { type GraphConfig, type GraphZoneConfig } from "./graphTypes";
import type { TotalsGraphVariant, TimelineGraphVariant } from "./graphTypes";
import {
  GetMyOverviewConfigDocument,
  type Workday,
  type UpdateMyOverviewConfigMutation,
  UpdateMyOverviewConfigDocument,
} from "../../graphql/generated/graphql";

type OverviewContextType = {
  overviewConfig: GraphZoneConfig[];
  isLoading: boolean;
  workdays: Workday[];
  handleGraphVariantChange: (
    value: TotalsGraphVariant | TimelineGraphVariant,
    graphIndex: number,
    zoneIndex: number,
  ) => void;
};

const OverviewContext = createContext<OverviewContextType | null>(null);

export default function OverviewContextProvider({
  children,
  workdays,
}: PropsWithChildren<{ workdays: Workday[] }>) {
  const { data, loading: isLoading } = useQuery(GetMyOverviewConfigDocument);
  const [updateOverviewConfig] = useMutation(UpdateMyOverviewConfigDocument);
  const overviewConfig = (data?.getMyOverviewConfig ?? []) as GraphZoneConfig[];

  const handleGraphVariantChange = useCallback(
    (value: TotalsGraphVariant | TimelineGraphVariant, graphIndex: number, zoneIndex: number) => {
      const newConfig = overviewConfig.map((zone, currentZoneIndex) =>
        currentZoneIndex === zoneIndex
          ? {
              ...zone,
              graphs: zone.graphs.map((graph, currentGraphIndex) =>
                currentGraphIndex === graphIndex
                  ? ({ ...graph, variant: value } as GraphConfig)
                  : graph,
              ),
            }
          : zone,
      );

      updateOverviewConfig({
        variables: { config: newConfig },
        optimisticResponse: {
          updateMyOverviewConfig: newConfig,
        } satisfies UpdateMyOverviewConfigMutation,
      });
    },
    [overviewConfig, updateOverviewConfig],
  );

  const contextValue = useMemo(() => {
    return {
      overviewConfig,
      isLoading,
      workdays,
      handleGraphVariantChange,
    };
  }, [overviewConfig, isLoading, workdays, handleGraphVariantChange]);

  return <OverviewContext.Provider value={contextValue}>{children}</OverviewContext.Provider>;
}

export function useOverviewConfig() {
  const context = useContext(OverviewContext);
  if (!context) {
    throw new Error("useOverviewConfig must be used within an OverviewContextProvider");
  }
  return context;
}
