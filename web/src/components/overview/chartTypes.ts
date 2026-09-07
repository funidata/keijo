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
