import { Workday } from "../../graphql/generated/graphql";
import type { ChartKey, GraphConfig } from "./chartTypes";
import useChartAreaConfig from "./OverviewContext";
import TotalsGraph from "./TotalsGraph";
import TimelineGraph from "./TimelineGraph";

interface GraphProps {
  graph: GraphConfig;
  graphIndex: number;
  chartKey: ChartKey;
  workdays: Workday[];
  sectionIndex: number;
}

export default function Graph(props: GraphProps) {
  const { handleTotalsChartVariantChange, handleTimelineChartVariantChange } = useChartAreaConfig();

  switch (props.graph.type) {
    case "totals":
      return (
        <TotalsGraph
          {...props}
          onChangeVariant={(variant) => {
            handleTotalsChartVariantChange(variant, props.graphIndex, props.sectionIndex);
          }}
        />
      );
    case "timeline":
      return (
        <TimelineGraph
          {...props}
          onChangeVariant={(variant) =>
            handleTimelineChartVariantChange(variant, props.graphIndex, props.sectionIndex)
          }
        />
      );
    default:
      return null;
  }
}
