import { Query, Resolver } from "@nestjs/graphql";
import { RecordType } from "./dto/record-type.dto";
import { RecordTypeService } from "./record-type.service";

@Resolver()
export class RecordTypeResolver {
  constructor(private recordTypeService: RecordTypeService) {}

  @Query(() => [RecordType])
  async findRecordTypes() {
    return this.recordTypeService.findAllRecordTypes();
  }
}
