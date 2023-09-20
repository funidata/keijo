import { literal, number, object, string, union } from "zod";
// FIXME: Split this into two to differentiate between audit logs.
/**
 * Output schema for JSON logs. All JSON output MUST adhere to this.
 *
 * - All fields SHOULD be optional, save for `logLevel`.
 * - Leaving fields out SHOULD be preferred over empty values.
 * - Existing fields MUST NOT be changed. New ones can be added.
 * - Output MUST be sanitized to remove fields not declared in this schema.
 */
export const jsonLogOutputSchema = object({
  logLevel: union([
    literal("error"),
    literal("warn"),
    literal("log"),
    literal("debug"),
    literal("audit"),
  ]),
  message: string().optional(),
  context: string().optional(),
  employeeNumber: number().optional(),
  operation: string().optional(),
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
});
