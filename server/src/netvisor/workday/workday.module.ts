import { Module } from "@nestjs/common";
import { NetvisorApiModule } from "../netvisor-api/netvisor-api.module";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { WorkdayResolver } from "./workday.resolver";
import { WorkdayService } from "./workday.service";

@Module({
  imports: [NetvisorApiModule],
  providers: [WorkdayResolver, WorkdayService, NetvisorApiService],
})
export class WorkdayModule {}
