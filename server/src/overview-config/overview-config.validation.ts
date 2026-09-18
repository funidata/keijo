import { z } from "zod";
import { OverviewGraphType, OverviewGroupBy } from "./dto/overview-config.dto";

const totalsGraphVariants = ["barVertical", "barHorizontal", "pie"] as const;
const timelineGraphVariants = ["stacked", "unstacked"] as const;

const overviewGraphSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(OverviewGraphType.Totals),
    variant: z.enum(totalsGraphVariants),
  }),
  z.object({
    type: z.literal(OverviewGraphType.Timeline),
    variant: z.enum(timelineGraphVariants),
  }),
]);

export const overviewConfigSchema = z
  .array(
    z.object({
      groupBy: z.enum(OverviewGroupBy),
      graphs: z.array(overviewGraphSchema).min(1),
    }),
  )
  .min(1);
