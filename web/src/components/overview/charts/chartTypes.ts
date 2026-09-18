import { Workday } from "../../../graphql/generated/schema-types";
import { GraphGroupByKey } from "../graphTypes";

export interface ChartProps {
  workdays: Workday[];
  groupBy: GraphGroupByKey;
}

export interface ChartDateRange {
  startDate: string;
  endDate: string;
}
