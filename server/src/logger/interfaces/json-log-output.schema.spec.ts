import { ZodOptionalDef, literal, number, object, string, union } from "zod";
import { jsonLogOutputSchema } from "./json-log-output.schema";

/**
 * ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 * DO NOT CHANGE THE EXISTING FIELDS IN JSON LOG OUTPUT SCHEMA. YOU WILL BREAK THINGS.
 * See `docs/logging.md`.
 * ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 */

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
const testZodDeep = (actual: ZodTestObject, test: ZodTestObject) => {
  // FIXME: Will not check nested `object()` fields.
  expect(actual._def.typeName).toEqual(test._def.typeName);

  if (test._def.innerType) {
    testZodDeep(actual._def.innerType, test._def.innerType);
  }
};

// Once again, the existing fields here should never change, new ones can be added.
const testSchema = object({
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
    dimensionNames: string().array().optional(),
    dimensionValues: string().array().optional(),
  }),
});

const actualKeys = Object.keys(jsonLogOutputSchema.shape);
const testKeys = Object.keys(testSchema.shape);

describe("JSON log output schema", () => {
  describe("That should never change", () => {
    describe("Has not changed", () => {
      it("Schema keys match exactly (no extras)", () => {
        expect(actualKeys).toMatchObject(testKeys);
      });

      it("Schema types match", () => {
        for (const key of testKeys) {
          const actualObj = jsonLogOutputSchema.shape[key];
          const testObj = testSchema.shape[key];
          testZodDeep(actualObj, testObj);
        }
      });
    });
  });
});
