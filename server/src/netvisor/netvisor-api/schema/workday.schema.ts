import { array, number, object, string, z as zod } from "zod";
import { dimensionSchema } from "./dimension.schema";

export const workdaySchema = object({
  Date: string(),
  WorkdayHour: array(
    object({
      Hours: number(),
      CollectorRatio: string(),
      AcceptanceStatus: string(),
      Description: string(),
      CrmProcessName: string(),
      Dimension: array(dimensionSchema).optional(),
    }),
  ),
});

export type WorkdaySchema = zod.infer<typeof workdaySchema>;
