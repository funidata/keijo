import { Module } from "@nestjs/common";
import { NetvisorApiModule } from "../netvisor-api/netvisor-api.module";
import { RecordTypeModule } from "../record-type/record-type.module";
import { EntryService } from "./entry.service";
import { WorkdayResolver } from "./workday.resolver";
import { WorkdayService } from "./workday.service";
import { JiraModule } from "../../jira/jira.module";

@Module({
  imports: [NetvisorApiModule, RecordTypeModule, JiraModule],
  providers: [WorkdayResolver, WorkdayService, EntryService],
})
export class WorkdayModule {}
