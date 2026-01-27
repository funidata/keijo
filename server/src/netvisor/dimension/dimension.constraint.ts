import { Injectable } from "@nestjs/common";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { AppLogger } from "../../logger/app-logger";
import { DimensionService } from "./dimension.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class DimensionConstraint implements ValidatorConstraintInterface {
  constructor(
    private logger: AppLogger,
    private dimensionService: DimensionService,
  ) {
    logger.setContext(DimensionConstraint.name);
  }

  /**
   * Validates dimension value against allowed empty values and values existing in Netvisor.
   */
  async validate(value: unknown, validationArguments: ValidationArguments): Promise<boolean> {
    const logError = (msg: string) =>
      this.logger.error(`${msg} ( dimension = ${validationArguments.property}, value = ${value} )`);

    // Skip checks for empty values – they are always OK.
    if (value === null || value === "") {
      return true;
    }

    if (typeof value !== "string") {
      logError("Dimension value must be a string.");
      return false;
    }

    const dimensionOptions = await this.dimensionService.findDimensionOptions();

    // Allow only dimensions that exist in Netvisor.
    if (!Object.keys(dimensionOptions).includes(validationArguments.property)) {
      logError("Dimension is not allowed.");
      return false;
    }

    // Allow only values that exist in Netvisor.
    if (!dimensionOptions[validationArguments.property].includes(value)) {
      logError("Dimension value not allowed.");
      return false;
    }

    return true;
  }
}
