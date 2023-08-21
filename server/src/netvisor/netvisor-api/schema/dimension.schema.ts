import { object, string, z as zod } from "zod";

export const dimensionSchema = object({
  DimensionName: string(),
  DimensionItem: string(),
});

export type DimensionSchema = zod.infer<typeof dimensionSchema>;
