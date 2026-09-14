import { OverviewGraphType, OverviewGroupBy, type OverviewZone } from "./dto/overview-config.dto";

export const DEFAULT_OVERVIEW_CONFIG: OverviewZone[] = [
  {
    groupBy: OverviewGroupBy.Product,
    graphs: [
      { type: OverviewGraphType.Totals, variant: "barVertical" },
      { type: OverviewGraphType.Timeline, variant: "stacked" },
    ],
  },
  {
    groupBy: OverviewGroupBy.Activity,
    graphs: [
      { type: OverviewGraphType.Totals, variant: "pie" },
      { type: OverviewGraphType.Timeline, variant: "unstacked" },
    ],
  },
];
