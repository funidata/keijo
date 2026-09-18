import type {
  GraphGroupByKey,
  GraphConfig,
  TotalsGraphVariant,
  TimelineGraphVariant,
} from "./graphTypes";
import { OverviewGraphType } from "./graphTypes";
import { useOverviewConfig } from "./OverviewContext";
import TimelineGraph from "./TimelineGraph";
import TotalsGraph from "./TotalsGraph";

interface GraphProps {
  config: GraphConfig;
  graphIndex: number;
  groupBy: GraphGroupByKey;
  zoneIndex: number;
}

export default function Graph(props: GraphProps) {
  const { handleGraphVariantChange } = useOverviewConfig();

  const graphProps = {
    config: props.config,
    graphIndex: props.graphIndex,
    groupBy: props.groupBy,
    zoneIndex: props.zoneIndex,
    onChangeVariant: (variant: TotalsGraphVariant | TimelineGraphVariant) =>
      handleGraphVariantChange(variant, props.graphIndex, props.zoneIndex),
  };

  switch (props.config.type) {
    case OverviewGraphType.Timeline:
      return <TimelineGraph {...graphProps} />;
    case OverviewGraphType.Totals:
      return <TotalsGraph {...graphProps} />;
    default:
      return null;
  }
}
