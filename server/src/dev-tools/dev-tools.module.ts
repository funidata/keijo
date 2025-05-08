import { Logger, Module } from "@nestjs/common";

/**
 * Tools for facilitating development and testing.
 *
 * DO NOT USE IN PRODUCTION.
 */
@Module({})
export class DevToolsModule {
  private readonly logger = new Logger(DevToolsModule.name);

  constructor() {
    this.logger.warn("*** WARNING!");
    this.logger.warn("*** Unsafe developer tools module is mounted.");
    this.logger.warn("*** DO NOT USE IN PRODUCTION!");
  }
}
