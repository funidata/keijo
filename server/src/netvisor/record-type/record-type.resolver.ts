import { Resolver } from "@nestjs/graphql";
import { RecordTypeService } from "./record-type.service";

@Resolver()
export class RecordTypeResolver {
  constructor(private recordTypeService: RecordTypeService) {}
}
