import { useState, useCallback } from "react";

type GraphConfig = TimelineChartConfig | TotalsChartConfig;
type TimelineChartVariant = "stacked" | "default";
type TimelineChartConfig = {
  variant: TimelineChartVariant;
  type: "timeline";
};
type TotalsChartVariant = "bar-vertical" | "bar-horizontal" | "pie";
type TotalsChartConfig = {
  type: "totals";
  variant: TotalsChartVariant;
};
interface GraphAreaConfig {
  title: string;
  graphs: GraphConfig[];
}

export default function useChartAreaConfig() {
  const [chartAreaConfig, setChartAreaConfig] = useState<GraphAreaConfig[]>([
    {
      title: "Tuotteittain",
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
      title: "Toiminnoittain",
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
  ]);

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
      setChartAreaConfig((prevConfig) => {
        const newConfig = [...prevConfig];
        newConfig[sectionIndex].graphs[graphIndex].variant = value;
        return newConfig;
      });
    },
    [],
  );

  return { chartAreaConfig, handleTotalsChartVariantChange, handleTimelineChartVariantChange };
}
