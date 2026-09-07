import { useState, useCallback, useContext, useMemo, createContext } from "react";
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

type OverviewContextType = {
  chartAreaConfig: GraphAreaConfig[];
  handleTotalsChartVariantChange: (
    value: TotalsChartVariant,
    graphIndex: number,
    sectionIndex: number,
  ) => void;
  handleTimelineChartVariantChange: (
    value: TimelineChartVariant,
    graphIndex: number,
    sectionIndex: number,
  ) => void;
  moveGraph: (sectionIndex: number, sourceIndex: number, targetIndex: number) => void;
  moveSection: (sourceIndex: number, targetIndex: number) => void;
};

const OverviewContext = createContext<OverviewContextType | null>(null);

export default function OverviewContextProvider({ children }: { children: React.ReactNode }) {
  const [chartAreaConfig, setChartAreaConfig] = useState<GraphAreaConfig[]>(getChartAreaConfig());

  const handleTotalsChartVariantChange = useCallback(
    (value: TotalsChartVariant, graphIndex: number, sectionIndex: number) => {
      setChartAreaConfig((currentConfig) => {
        const newConfig = currentConfig.map((section, currentSectionIndex) =>
          currentSectionIndex === sectionIndex
            ? {
                ...section,
                graphs: section.graphs.map((graph, currentGraphIndex) =>
                  currentGraphIndex === graphIndex && graph.type === "totals"
                    ? { ...graph, variant: value }
                    : graph,
                ),
              }
            : section,
        );

        localStorage.setItem(chartAreaConfigStorageKey, JSON.stringify(newConfig));
        return newConfig;
      });
    },
    [],
  );

  const handleTimelineChartVariantChange = useCallback(
    (value: TimelineChartVariant, graphIndex: number, sectionIndex: number) => {
      setChartAreaConfig((currentConfig) => {
        const newConfig = currentConfig.map((section, currentSectionIndex) =>
          currentSectionIndex === sectionIndex
            ? {
                ...section,
                graphs: section.graphs.map((graph, currentGraphIndex) =>
                  currentGraphIndex === graphIndex && graph.type === "timeline"
                    ? { ...graph, variant: value }
                    : graph,
                ),
              }
            : section,
        );

        localStorage.setItem(chartAreaConfigStorageKey, JSON.stringify(newConfig));
        return newConfig;
      });
    },
    [],
  );

  const moveGraph = useCallback(
    (sectionIndex: number, sourceIndex: number, targetIndex: number) => {
      if (sourceIndex === targetIndex) {
        return;
      }

      setChartAreaConfig((currentConfig) => {
        const section = currentConfig[sectionIndex];
        const graphs = [...section.graphs];
        const [graph] = graphs.splice(sourceIndex, 1);

        if (!graph) {
          return currentConfig;
        }

        graphs.splice(targetIndex, 0, graph);
        const newConfig = [...currentConfig];
        newConfig[sectionIndex] = { ...section, graphs };

        localStorage.setItem(chartAreaConfigStorageKey, JSON.stringify(newConfig));
        return newConfig;
      });
    },
    [],
  );

  const moveSection = useCallback((sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) {
      return;
    }

    setChartAreaConfig((currentConfig) => {
      const newConfig = [...currentConfig];
      const [section] = newConfig.splice(sourceIndex, 1);

      if (!section) {
        return currentConfig;
      }

      newConfig.splice(targetIndex, 0, section);
      localStorage.setItem(chartAreaConfigStorageKey, JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  const contextValue = useMemo(() => {
    return {
      chartAreaConfig,
      handleTotalsChartVariantChange,
      handleTimelineChartVariantChange,
      moveGraph,
      moveSection,
    };
  }, [
    chartAreaConfig,
    handleTotalsChartVariantChange,
    handleTimelineChartVariantChange,
    moveGraph,
    moveSection,
  ]);

  return <OverviewContext.Provider value={contextValue}>{children}</OverviewContext.Provider>;
}

export function useChartAreaConfig() {
  const context = useContext(OverviewContext);
  if (!context) {
    throw new Error("useChartAreaConfig must be used within an OverviewContextProvider");
  }
  return context;
}
