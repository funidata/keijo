import { z } from "zod";
import {
  OverviewGraphType,
  OverviewGraphVariant,
  OverviewGroupBy,
} from "./dto/overview-config.dto";

const overviewGraphSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(OverviewGraphType.Totals),
    variant: z.enum([
      OverviewGraphVariant.BarVertical,
      OverviewGraphVariant.BarHorizontal,
      OverviewGraphVariant.Pie,
    ]),
  }),
  z.object({
    type: z.literal(OverviewGraphType.Timeline),
    variant: z.enum([OverviewGraphVariant.Stacked, OverviewGraphVariant.Unstacked]),
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
