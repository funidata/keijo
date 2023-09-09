import { Module } from "@nestjs/common";
import { DimensionModule } from "./dimension/dimension.module";
import { RecordTypeModule } from "./record-type/record-type.module";
import { WorkdayModule } from "./workday/workday.module";

/**
 * Integration with Netvisor XML API.
 */
@Module({
  imports: [WorkdayModule, DimensionModule, RecordTypeModule],
})
export class NetvisorModule {}
