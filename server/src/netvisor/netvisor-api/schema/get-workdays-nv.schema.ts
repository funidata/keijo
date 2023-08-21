import { array, string, union, z as zod } from "zod";
import { rootSchema } from "./root.schema";
import { workdaySchema } from "./workday.schema";

export const getWorkdaysNvSchema = rootSchema.extend({
  WorkDays: union([string().length(0), workdaySchema, array(workdaySchema)]),
});

export type GetWorkdaysNvSchema = zod.infer<typeof getWorkdaysNvSchema>;
