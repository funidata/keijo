import { Workday, Entry } from "../../graphql/generated/graphql";

export type ChartKey = keyof Entry;

export interface ChartProps {
  workdays: Workday[];
  chartKey: ChartKey;
}

export interface ChartDateRange {
  startDate: string;
  endDate: string;
}

export type TimelineChartVariant = "stacked" | "default";
type TimelineChartConfig = {
  variant: TimelineChartVariant;
  type: "timeline";
};

export type TotalsChartVariant = "bar-vertical" | "bar-horizontal" | "pie";
type TotalsChartConfig = {
  type: "totals";
  variant: TotalsChartVariant;
};

export type GraphConfig = TimelineChartConfig | TotalsChartConfig;
export interface GraphAreaConfig {
  key: ChartKey;
  graphs: GraphConfig[];
}
