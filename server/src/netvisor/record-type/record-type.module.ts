import { Module } from "@nestjs/common";
import { NetvisorApiModule } from "../netvisor-api/netvisor-api.module";
import { RecordTypeCacheService } from "./record-type-cache.service";
import { RecordTypeResolver } from "./record-type.resolver";
import { RecordTypeService } from "./record-type.service";

@Module({
  imports: [NetvisorApiModule],
  providers: [RecordTypeService, RecordTypeCacheService, RecordTypeResolver],
})
export class RecordTypeModule {}
