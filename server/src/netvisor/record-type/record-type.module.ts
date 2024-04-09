import { Module } from "@nestjs/common";
import { NetvisorApiModule } from "../netvisor-api/netvisor-api.module";
import { RecordTypeCacheService } from "./record-type-cache.service";

@Module({
  imports: [NetvisorApiModule],
  providers: [RecordTypeCacheService],
})
export class RecordTypeModule {}
