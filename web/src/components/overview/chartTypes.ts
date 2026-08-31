import { Workday, Entry } from "../../graphql/generated/graphql";

export interface ChartProps {
  workdays: Workday[];
  chartKey: keyof Entry;
}
