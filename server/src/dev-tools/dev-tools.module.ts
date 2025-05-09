import { Logger, Module } from "@nestjs/common";
import { UserSettingsModule } from "../user-settings/user-settings.module";
import { DevToolsController } from "./dev-tools.controller";
import { DevToolsService } from "./dev-tools.service";

/**
 * Tools for facilitating development and testing.
 *
 * DO NOT USE IN PRODUCTION.
 */
@Module({
  imports: [UserSettingsModule],
  providers: [DevToolsService],
  controllers: [DevToolsController],
})
export class DevToolsModule {
  private readonly logger = new Logger(DevToolsModule.name);

  constructor() {
    this.logger.warn("*** WARNING!");
    this.logger.warn("*** Unsafe developer tools module is mounted.");
    this.logger.warn("*** DO NOT USE IN PRODUCTION!");
  }
}
