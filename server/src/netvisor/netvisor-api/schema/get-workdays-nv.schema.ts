import { array, z as zod } from "zod";
import { rootSchema } from "./root.schema";
import { workdaySchema } from "./workday.schema";

export const getWorkdaysNvSchema = rootSchema.extend({
  WorkDays: array(workdaySchema),
});

export type GetWorkdaysNvSchema = zod.infer<typeof getWorkdaysNvSchema>;

export const getWorkdaysNvArrays = ["Root.WorkDays.Workday"];
