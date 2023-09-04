import { Module } from "@nestjs/common";
import { DimensionModule } from "./dimension/dimension.module";
import { WorkdayModule } from "./workday/workday.module";

/**
 * Integration with Netvisor XML API.
 */
@Module({
  imports: [WorkdayModule, DimensionModule],
})
export class NetvisorModule {}
