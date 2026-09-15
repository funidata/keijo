import {
  OverviewGraphType,
  OverviewGraphVariant,
  OverviewGroupBy,
} from "../../graphql/generated/graphql";
import type { Entry } from "../../graphql/generated/graphql";

export { OverviewGraphType, OverviewGroupBy };

/**
 * The property key of Entry objects, upon which graph data will be categorized and accumulated.
 */
export type GraphGroupByKey = keyof Entry;

/**
 * Configuration for a timeline graph, which displays data over time in
 * various visual formats. This type of graph is useful for visualizing trends
 * and patterns in worktime data over time.
 */
export const TimelineGraphVariant = {
  Stacked: OverviewGraphVariant.Stacked,
  Unstacked: OverviewGraphVariant.Unstacked,
} as const;

export type TimelineGraphVariant = (typeof TimelineGraphVariant)[keyof typeof TimelineGraphVariant];

type TimelineGraphConfig = {
  variant: TimelineGraphVariant;
  type: OverviewGraphType.Timeline;
};

/**
 * Configuration for a totals graph, which displays accumulated worktime data in
 * various visual formats. This type of graph is useful for visualizing the
 * overall distribution of worktime data.
 */
export const TotalsGraphVariant = {
  BarVertical: OverviewGraphVariant.BarVertical,
  BarHorizontal: OverviewGraphVariant.BarHorizontal,
  Pie: OverviewGraphVariant.Pie,
} as const;

export type TotalsGraphVariant = (typeof TotalsGraphVariant)[keyof typeof TotalsGraphVariant];

type TotalsGraphConfig = {
  type: OverviewGraphType.Totals;
  variant: TotalsGraphVariant;
};

export type GraphConfig = TimelineGraphConfig | TotalsGraphConfig;

/**
 * Configuration for a single graph zone, which can contain multiple graphs.
 */
export interface GraphZoneConfig {
  groupBy: OverviewGroupBy;
  graphs: GraphConfig[];
}
