import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Config, configSchema } from "./config.schema";

/**
 * Provides configuration by dynamically importing the config file. This enables easy mocking
 * in unit and integration tests.
 */
@Injectable()
export class ConfigService {
  config: Config;
  private readonly logger = new Logger(ConfigService.name);

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require("./config").default;

    try {
      this.config = configSchema.parse(config);
    } catch (error) {
      this.logger.error("Invalid configuration.");
      throw error;
    }

    if (!config.inDev && config.mockEmployeeId) {
      throw new InternalServerErrorException(
        "Mock employee ID cannot be used in production environment.",
      );
    }
  }
}
