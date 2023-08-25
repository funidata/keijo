import { boolean, literal, number, object, string, union, z as zod } from "zod";

export const configSchema = object({
  nodeEnv: union([literal("production"), literal("development")]),
  inDev: boolean(),
  port: number(),
  employeeNumberHeaderKey: string(),
  netvisor: object({
    host: string(),
    sender: string(),
    partnerId: string(),
    lang: union([literal("fi"), literal("en"), literal("se")]),
    customerId: string(),
    organizationId: string(),
    customerKey: string(),
    organizationKey: string(),
  }),
});

export type Config = zod.infer<typeof configSchema>;
