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
  eppn: string().optional(),
  xml: string().optional(),
  input: object({
    date: string().optional(),
    duration: number().optional(),
    ratioNumber: number().optional(),
    description: string().optional(),
    // Deprecated using .length(0) in favor of named fields.
    dimensionNames: string().array().length(0).optional(),
    // Deprecated using .length(0) in favor of named fields.
    dimensionValues: string().array().length(0).optional(),
    entryKey: string().optional(),
    product: string().nullable().optional(),
    activity: string().nullable().optional(),
    issue: string().nullable().optional(),
    client: string().nullable().optional(),
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
