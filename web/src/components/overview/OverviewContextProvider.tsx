import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, PropsWithChildren, useCallback, useState } from "react";
import { OverviewContext } from "./OverviewContext";
import { type GraphConfig, type GraphZoneConfig } from "./graphTypes";
import type { TotalsGraphVariant, TimelineGraphVariant } from "./graphTypes";
import {
  GetMyOverviewConfigDocument,
  type Workday,
  UpdateMyOverviewConfigDocument,
} from "../../graphql/generated/graphql";

type WithoutTypename<T> = T extends object ? Omit<T, "__typename"> : never;

const withoutTypename = <T extends object>(value: T): WithoutTypename<T> => {
  const input = { ...value } as T & { __typename?: string };
  delete input.__typename;
  return input as unknown as WithoutTypename<T>;
};

export default function OverviewContextProvider({
  children,
  workdays,
}: PropsWithChildren<{ workdays: Workday[] }>) {
  const { data, loading: isLoading } = useQuery(GetMyOverviewConfigDocument);
  const [updateOverviewConfig] = useMutation(UpdateMyOverviewConfigDocument);
  const serverConfig = (data?.getMyOverviewConfig ?? []) as GraphZoneConfig[];
  const [localConfig, setLocalConfig] = useState<GraphZoneConfig[] | null>(null);
  const overviewConfig = localConfig ?? serverConfig;

  const handleGraphVariantChange = useCallback(
    (value: TotalsGraphVariant | TimelineGraphVariant, graphIndex: number, zoneIndex: number) => {
      const newConfig = overviewConfig.map((zone, currentZoneIndex) => {
        const zoneInput = withoutTypename(zone);
        const graphs = zone.graphs.map((graph, currentGraphIndex) => {
          const graphInput = withoutTypename(graph);

          return currentZoneIndex === zoneIndex && currentGraphIndex === graphIndex
            ? ({ ...graphInput, variant: value } as GraphConfig)
            : graphInput;
        });

        return { ...zoneInput, graphs };
      });

      setLocalConfig(newConfig);
      updateOverviewConfig({
        variables: { config: newConfig },
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
