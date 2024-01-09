/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodObject, ZodOptionalDef, literal, number, object, string, union } from "zod";
import { jsonAppLogOutputSchema, jsonAuditLogOutputSchema } from "./json-log-output.schema";

/**
 * ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 * DO NOT CHANGE THE EXISTING FIELDS IN JSON LOG OUTPUT SCHEMA. YOU WILL BREAK THINGS.
 * See `docs/logging.md`.
 * ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
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
    dimensionNames: string().array().length(0).optional(),
    dimensionValues: string().array().length(0).optional(),
    entryKey: string().optional(),
    product: string().nullable().optional(),
    activity: string().nullable().optional(),
    issue: string().nullable().optional(),
    client: string().nullable().optional(),
  }).optional(),
};

const appLogTestSchema = object(appLogFields);
const auditLogTestSchema = object({ ...appLogFields, ...auditLogFields });

type ZodTestObject = {
  _def: ZodOptionalDef;
};

/**
 * Recursive equality check for Zod objects.
 *
 * Zod objects are composed from nested objects that completely describe the resulting
 * type. Therefore we can check for equality by comparing the `typeName` recursively
 * for each level of nesting.
 */
const testZodObjectDeep = (actual: ZodTestObject, test: ZodTestObject) => {
  expect(actual._def.typeName).toEqual(test._def.typeName);

  if (test._def.innerType) {
    testZodObjectDeep(actual._def.innerType, test._def.innerType);
  }
};

/**
 * Deep equality check for Zod schemas.
 *
 * Detects nested objects and runs recursively on them.
 */
const testZodSchema = (actual: ZodObject<any>, test: ZodObject<any>) => {
  Object.entries<any>(test.shape).forEach(([key, testObj]) => {
    const actualObj = actual.shape[key];
    testZodObjectDeep(actualObj, testObj);

    if (testObj._def.typeName === "ZodObject") {
      testZodSchema(actualObj, testObj as any);
    }

    if (testObj._def.innerType?._def.typeName === "ZodObject") {
      const innerActualObj = actualObj._def.innerType;
      const innerTestObj = testObj._def.innerType as ZodObject<any>;
      testZodSchema(innerActualObj, innerTestObj);
    }
  });
};

describe("JSON log output schema", () => {
  describe("That should never change", () => {
    describe("Has not changed", () => {
      it("App logs", () => {
        testZodSchema(jsonAppLogOutputSchema, appLogTestSchema);
        // Running this again with switched arguments is a dirty little hack to
        // rule out missing fields both ways without extra work.
        testZodSchema(appLogTestSchema, jsonAppLogOutputSchema);
      });

      it("Audit logs", () => {
        testZodSchema(jsonAuditLogOutputSchema, auditLogTestSchema);
        testZodSchema(auditLogTestSchema, jsonAuditLogOutputSchema);
      });
    });
  });
});
