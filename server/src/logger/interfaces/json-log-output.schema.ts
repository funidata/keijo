import { literal, number, object, string, union, z as zod } from "zod";

/*
 * Output schemas for JSON logs. All JSON output MUST adhere to these.
 *
 * - All fields SHOULD be optional, save for `logLevel`.
 * - Leaving fields out SHOULD be preferred over empty values.
 * - Existing fields MUST NOT be changed. New ones can be added.
 * - Output MUST be sanitized to remove fields not declared in this schema.
 */

const appLogFields = {
  logLevel: union([literal("error"), literal("warn"), literal("log"), literal("debug")]),
  date: string(),
  message: string().optional(),
  context: string().optional(),
  operation: string().optional(),
  errors: string().array().optional(),
};

const auditLogFields = {
  logLevel: literal("audit"),
  employeeNumber: number().optional(),
  xml: string().optional(),
  input: object({
    date: string().optional(),
    duration: number().optional(),
    ratioNumber: number().optional(),
    description: string().optional(),
    // We were not sure if logging lists of objects is a good idea, thus dimension
    // data is logged as two lists of strings. This data is probably never needed
    // to be used programmatically, so this should be fine.
    dimensionNames: string().array().optional(),
    dimensionValues: string().array().optional(),
  }).optional(),
};

/**
 * JSON log output schema for app logs (no sensitive data).
 */
export const jsonAppLogOutputSchema = object(appLogFields);
export type JsonAppLogOutputSchema = zod.infer<typeof jsonAppLogOutputSchema>;

/**
 * JSON log output schema for audit logs (includes sensitive data).
 */
export const jsonAuditLogOutputSchema = object({ ...appLogFields, ...auditLogFields });
export type JsonAuditLogOutputSchema = zod.infer<typeof jsonAuditLogOutputSchema>;
