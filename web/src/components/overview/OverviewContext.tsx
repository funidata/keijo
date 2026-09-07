import { useState, useCallback, useContext, createContext } from "react";
import { GraphAreaConfig, TotalsChartVariant, TimelineChartVariant } from "./chartTypes";

const defaultChartAreaConfig: GraphAreaConfig[] = [
  {
    key: "product",
    graphs: [
      {
        type: "totals",
        variant: "bar-vertical",
      },
      {
        type: "timeline",
        variant: "stacked",
      },
    ],
  },
  {
    key: "activity",
    graphs: [
      {
        type: "totals",
        variant: "pie",
      },
      {
        type: "timeline",
        variant: "default",
      },
    ],
  },
];

function getChartAreaConfig() {
  const storedConfig = localStorage.getItem(chartAreaConfigStorageKey);
  return storedConfig ? JSON.parse(storedConfig) : defaultChartAreaConfig;
}

const chartAreaConfigStorageKey = "chartAreaConfig";

const OverviewContext = createContext<{
  chartAreaConfig: GraphAreaConfig[];
  handleTotalsChartVariantChange: (value: TotalsChartVariant, graphIndex: number, sectionIndex: number) => void;
  handleTimelineChartVariantChange: (value: TimelineChartVariant, graphIndex: number, sectionIndex: number) => void;
} | null>(null);

export default function OverviewContextProvider({ children }: { children: React.ReactNode }) {
  const [chartAreaConfig, setChartAreaConfig] = useState<GraphAreaConfig[]>(getChartAreaConfig());

  const handleTotalsChartVariantChange = useCallback(
    (value: TotalsChartVariant, graphIndex: number, sectionIndex: number) => {
      const newConfig = [...chartAreaConfig];
      newConfig[sectionIndex].graphs[graphIndex].variant = value;

      setChartAreaConfig(newConfig);
      localStorage.setItem(chartAreaConfigStorageKey, JSON.stringify(newConfig));
    },
    [],
  );

  const handleTimelineChartVariantChange = useCallback(
    (value: TimelineChartVariant, graphIndex: number, sectionIndex: number) => {
      const newConfig = [...chartAreaConfig];
      newConfig[sectionIndex].graphs[graphIndex].variant = value;

      setChartAreaConfig(newConfig);
      localStorage.setItem(chartAreaConfigStorageKey, JSON.stringify(newConfig));
    },
    [],
  );

  const contextValue = {
    chartAreaConfig,
    handleTotalsChartVariantChange,
    handleTimelineChartVariantChange,
  };

  return (
    <OverviewContext.Provider value={contextValue}>
      {children}
    </OverviewContext.Provider>
  );
}

export function useChartAreaConfig() {
  const context = useContext(OverviewContext);
  if (!context) {
    throw new Error("useChartAreaConfig must be used within an OverviewContextProvider");
  }
  return context;
}
