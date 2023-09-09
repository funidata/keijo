import { Module } from "@nestjs/common";
import { RecordTypeResolver } from "./record-type.resolver";
import { RecordTypeService } from "./record-type.service";

@Module({
  providers: [RecordTypeService, RecordTypeResolver],
})
export class RecordTypeModule {}
