import { TimelineGraphVariant, TotalsGraphVariant, type GraphZoneConfig } from "./graphTypes";

export const OVERVIEW_CONFIG_LOCALSTORAGE_KEY = "overviewConfig";
export const DEFAULT_OVERVIEW_CONFIG: GraphZoneConfig[] = [
  {
    groupBy: "product",
    graphs: [
      {
        type: "totals",
        variant: TotalsGraphVariant.BarVertical,
      },
      {
        type: "timeline",
        variant: TimelineGraphVariant.Stacked,
      },
    ],
  },
  {
    groupBy: "activity",
    graphs: [
      {
        type: "totals",
        variant: TotalsGraphVariant.Pie,
      },
      {
        type: "timeline",
        variant: TimelineGraphVariant.Unstacked,
      },
    ],
  },
];
