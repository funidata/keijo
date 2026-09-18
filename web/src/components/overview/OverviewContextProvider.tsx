import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, PropsWithChildren, useCallback } from "react";
import { OverviewContext } from "./OverviewContext";
import { type GraphConfig, type GraphZoneConfig } from "./graphTypes";
import type { TotalsGraphVariant, TimelineGraphVariant } from "./graphTypes";
import {
  GetMyOverviewConfigDocument,
  type Workday,
  type UpdateMyOverviewConfigMutation,
  UpdateMyOverviewConfigDocument,
} from "../../graphql/generated/graphql";

export default function OverviewContextProvider({
  children,
  workdays,
}: PropsWithChildren<{ workdays: Workday[] }>) {
  const { data, loading: isLoading } = useQuery(GetMyOverviewConfigDocument);
  const [updateOverviewConfig] = useMutation(UpdateMyOverviewConfigDocument);
  const overviewConfig = useMemo(
    () => (data?.getMyOverviewConfig ?? []) as GraphZoneConfig[],
    [data?.getMyOverviewConfig],
  );

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
