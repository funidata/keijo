import { Injectable } from "@nestjs/common";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { DimensionService } from "./dimension.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class DimensionConstraint implements ValidatorConstraintInterface {
  constructor(private dimensionService: DimensionService) {}

  /**
   * Validates dimension value against allowed empty values and values existing in Netvisor.
   */
  async validate(value: unknown, validationArguments: ValidationArguments): Promise<boolean> {
    if (value === null || value === "") {
      return true;
    }

    if (typeof value !== "string") {
      return false;
    }

    const dimensionOptions = await this.dimensionService.findDimensionOptions();

    if (!Object.keys(dimensionOptions).includes(validationArguments.property)) {
      return false;
    }

    if (dimensionOptions[validationArguments.property].includes(value)) {
      return true;
    }

    return false;
  }
}
