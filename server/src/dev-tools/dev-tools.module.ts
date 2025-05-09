import { Logger, Module, OnModuleInit } from "@nestjs/common";
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
export class DevToolsModule implements OnModuleInit {
  private readonly logger = new Logger(DevToolsModule.name);

  constructor() {
    this.logger.warn("*** WARNING!");
    this.logger.warn("*** Unsafe developer tools module is mounted.");
    this.logger.warn("*** DO NOT USE IN PRODUCTION!");
  }

  onModuleInit() {
    // Protect against being accidentally mounted in production.
    const production = process.env.NODE_ENV === "production";
    const ci = process.env.CI === "true";
    const devTools = process.env.DEV_TOOLS === "true";

    if (!devTools) {
      throw new Error("DevToolsModule was mounted but DEV_TOOLS env var is not enabled.");
    }

    if (production && !ci) {
      throw new Error(
        "DevToolsModule was mounted while running in production mode but CI env var is not true.",
      );
    }
  }
}
