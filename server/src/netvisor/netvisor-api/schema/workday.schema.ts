import { array, number, object, string, union, z as zod } from "zod";
import { dimensionSchema } from "./dimension.schema";

export const workdaySchema = object({
  Date: string(),
  WorkdayHour: object({
    Hours: number(),
    CollectorRatio: string(),
    AcceptanceStatus: string(),
    Description: string(),
    CrmProcessName: string(),
    Dimension: union([string().length(0), array(dimensionSchema)]).optional(),
  }),
});

export type WorkdaySchema = zod.infer<typeof workdaySchema>;
