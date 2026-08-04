import { ValidatorOptions, registerDecorator } from "class-validator";
import { DimensionConstraint } from "./dimension.constraint";

/**
 * Ensure that dimension value is valid.
 *
 * Decorated property name must be one of the keys of `DimensionOptions`.
 */
export const IsDimensionValue =
  (validationOptions?: ValidatorOptions) => (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DimensionConstraint,
    });
  };
