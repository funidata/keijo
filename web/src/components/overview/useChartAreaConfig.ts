import { useState, useCallback } from "react";
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
export default function useChartAreaConfig() {
  const [chartAreaConfig, setChartAreaConfig] = useState<GraphAreaConfig[]>(getChartAreaConfig());

  const handleTotalsChartVariantChange = useCallback(
    (value: TotalsChartVariant, graphIndex: number, sectionIndex: number) => {
      setChartAreaConfig((prevConfig) => {
        const newConfig = [...prevConfig];
        newConfig[sectionIndex].graphs[graphIndex].variant = value;
        return newConfig;
      });
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

  return { chartAreaConfig, handleTotalsChartVariantChange, handleTimelineChartVariantChange };
}
