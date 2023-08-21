import { array, literal, object, string, union, z as zod } from "zod";

export const rootSchema = object({
  ResponseStatus: object({
    Status: union([literal("OK"), array(string())]),
    TimeStamp: string(),
  }),
});

export type RootSchema = zod.infer<typeof rootSchema>;
