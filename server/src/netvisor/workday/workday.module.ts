import { Module } from "@nestjs/common";
import { NetvisorApiModule } from "../netvisor-api/netvisor-api.module";
import { RecordTypeModule } from "../record-type/record-type.module";
import { EntryService } from "./entry.service";
import { WorkdayResolver } from "./workday.resolver";
import { WorkdayService } from "./workday.service";

@Module({
  imports: [NetvisorApiModule, RecordTypeModule],
  providers: [WorkdayResolver, WorkdayService, EntryService],
})
export class WorkdayModule {}
