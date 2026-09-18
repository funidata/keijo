import {
  OverviewGraphType,
  OverviewGraphVariant,
  OverviewGroupBy,
  type OverviewZone,
} from "./dto/overview-config.dto";

export const DEFAULT_OVERVIEW_CONFIG: OverviewZone[] = [
  {
    groupBy: OverviewGroupBy.Product,
    graphs: [
      { type: OverviewGraphType.Totals, variant: OverviewGraphVariant.BarVertical },
      { type: OverviewGraphType.Timeline, variant: OverviewGraphVariant.Stacked },
    ],
  },
  {
    groupBy: OverviewGroupBy.Activity,
    graphs: [
      { type: OverviewGraphType.Totals, variant: OverviewGraphVariant.Pie },
      { type: OverviewGraphType.Timeline, variant: OverviewGraphVariant.Unstacked },
    ],
  },
];
