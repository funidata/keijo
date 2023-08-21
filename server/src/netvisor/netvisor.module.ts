import { Module } from "@nestjs/common";
import { WorkdayModule } from "./workday/workday.module";

/**
 * Integration with Netvisor XML API.
 */
@Module({
  imports: [WorkdayModule],
})
export class NetvisorModule {}
