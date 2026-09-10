import {
  useContext,
  useMemo,
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import {
  TimelineGraphVariant,
  TotalsGraphVariant,
  type GraphConfig,
  type GraphZoneConfig,
} from "./graphTypes";
import type { Workday } from "../../graphql/generated/graphql";
import { DEFAULT_OVERVIEW_CONFIG, OVERVIEW_CONFIG_LOCALSTORAGE_KEY } from "./constants";
import { useLocalStorage } from "usehooks-ts";

function isTimelineGraphVariant(value: unknown): value is TimelineGraphVariant {
  return Object.values(TimelineGraphVariant).includes(value as TimelineGraphVariant);
}

function isTotalsGraphVariant(value: unknown): value is TotalsGraphVariant {
  return Object.values(TotalsGraphVariant).includes(value as TotalsGraphVariant);
}

function isGraphConfig(value: unknown): value is GraphConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "variant" in value &&
    ((value.type === "timeline" && isTimelineGraphVariant(value.variant)) ||
      (value.type === "totals" && isTotalsGraphVariant(value.variant)))
  );
}

function isOverviewConfig(value: unknown): value is GraphZoneConfig[] {
  return (
    Array.isArray(value) &&
    value.every(
      (zone) =>
        typeof zone === "object" &&
        zone !== null &&
        "groupBy" in zone &&
        typeof zone.groupBy === "string" &&
        "graphs" in zone &&
        Array.isArray(zone.graphs) &&
        zone.graphs.every(isGraphConfig),
    )
  );
}

function deserializer(value: string): GraphZoneConfig[] {
  const defaultValue = DEFAULT_OVERVIEW_CONFIG;

  if (value === "undefined") {
    return DEFAULT_OVERVIEW_CONFIG;
  }

  let parsedConfig: unknown;
  try {
    parsedConfig = JSON.parse(value);

    if (isOverviewConfig(parsedConfig)) {
      return parsedConfig;
    } else {
      return defaultValue; // Return defaultValue if parsed config is not valid
    }
  } catch (_) {
    return defaultValue; // Return initialValue if parsing fails
  }
}

type OverviewContextType = {
  overviewConfig: GraphZoneConfig[];
  workdays: Workday[];
  handleGraphVariantChange: (
    value: TotalsGraphVariant | TimelineGraphVariant,
    graphIndex: number,
    zoneIndex: number,
  ) => void;
  updateOverviewConfig: (
    update: GraphZoneConfig[] | ((previousConfig: GraphZoneConfig[]) => GraphZoneConfig[]),
  ) => void;
};

const OverviewContext = createContext<OverviewContextType | null>(null);

export default function OverviewContextProvider({
  children,
  workdays,
}: PropsWithChildren<{ workdays: Workday[] }>) {
  const [overviewConfig, setOverviewConfig] = useLocalStorage(
    OVERVIEW_CONFIG_LOCALSTORAGE_KEY,
    DEFAULT_OVERVIEW_CONFIG,
    { deserializer },
  );

  const updateOverviewConfig = useCallback(
    (update: GraphZoneConfig[] | ((previousConfig: GraphZoneConfig[]) => GraphZoneConfig[])) => {
      setOverviewConfig(update);
    },
    [],
  );

  useEffect(() => {
    localStorage.setItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY, JSON.stringify(overviewConfig));
  }, [overviewConfig]);

  const handleGraphVariantChange = useCallback(
    (value: TotalsGraphVariant | TimelineGraphVariant, graphIndex: number, zoneIndex: number) => {
      updateOverviewConfig((previousConfig) =>
        previousConfig.map((zone, currentZoneIndex) =>
          currentZoneIndex === zoneIndex
            ? {
                ...zone,
                graphs: zone.graphs.map((graph, currentGraphIndex) =>
                  currentGraphIndex !== graphIndex
                    ? graph
                    : graph.type === "timeline" && isTimelineGraphVariant(value)
                      ? { ...graph, variant: value }
                      : graph.type === "totals" && isTotalsGraphVariant(value)
                        ? { ...graph, variant: value }
                        : graph,
                ),
              }
            : zone,
        ),
      );
    },
    [updateOverviewConfig],
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
