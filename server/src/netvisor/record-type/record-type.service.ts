import { Injectable } from "@nestjs/common";
import { isNumber } from "lodash";
import { RecordType } from "./dto/record-type.dto";
import { RecordTypeCacheService } from "./record-type-cache.service";

@Injectable()
export class RecordTypeService {
  constructor(private recordTypeCacheService: RecordTypeCacheService) {}

  async findAllRecordTypes(): Promise<RecordType> {
    const data = await this.recordTypeCacheService.getCachedRecordTypeData();

    return data.Root.RecordTypes.RecordType.map((recordType) => ({
      name: recordType.Names.Name[0]["#text"],
      ratioNumber: recordType.RatioNumber,
    })).filter((rec) => isNumber(rec.ratioNumber));
  }
}
