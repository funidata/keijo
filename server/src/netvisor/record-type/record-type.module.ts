import { Module } from "@nestjs/common";
import { NetvisorApiModule } from "../netvisor-api/netvisor-api.module";
import { RecordTypeCacheService } from "./record-type-cache.service";
import { RecordTypeService } from "./record-type.service";

@Module({
  imports: [NetvisorApiModule],
  providers: [RecordTypeService, RecordTypeCacheService],
  exports: [RecordTypeService],
})
export class RecordTypeModule {}
