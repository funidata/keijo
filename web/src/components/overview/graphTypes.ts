import { Entry } from "../../graphql/generated/graphql";

/**
 * The property key of Entry objects, upon which graph data will be categorized and accumulated.
 */
export type GraphGroupByKey = keyof Entry;

export enum TimelineGraphVariant {
  Stacked = "stacked",
  Unstacked = "unstacked",
}
/**
 * Configuration for a timeline graph, which displays data over time in
 * various visual formats. This type of graph is useful for visualizing trends
 * and patterns in worktime data over time.
 */
type TimelineGraphConfig = {
  variant: TimelineGraphVariant;
  type: "timeline";
};

export enum TotalsGraphVariant {
  BarVertical = "barVertical",
  BarHorizontal = "barHorizontal",
  Pie = "pie",
}

/**
 * Configuration for a totals graph, which displays accumulated worktime data in
 * various visual formats. This type of graph is useful for visualizing the
 * overall distribution of worktime data.
 */
type TotalsGraphConfig = {
  type: "totals";
  variant: TotalsGraphVariant;
};

export type GraphConfig = TimelineGraphConfig | TotalsGraphConfig;

/**
 * Configuration for a single graph zone, which can contain multiple graphs.
 */
export interface GraphZoneConfig {
  groupBy: GraphGroupByKey;
  graphs: GraphConfig[];
}
