import { Injectable } from "@nestjs/common";
import { RecordType } from "./dto/record-type.dto";
import { RecordTypeCacheService } from "./record-type-cache.service";

@Injectable()
export class RecordTypeService {
  constructor(private recordTypeCacheService: RecordTypeCacheService) {}

  async getRecordTypes(): Promise<RecordType[]> {
    const data = await this.recordTypeCacheService.getRecordTypes();

    return data.Root.RecordTypes.RecordType.map((recordTypeData) => ({
      name: this.getName(recordTypeData),
      ratioNumber: this.getRatioNumber(recordTypeData),
      unitIsHour: recordTypeData.UnitType === 1,
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getName = (recordTypeData: any) =>
    recordTypeData.Names.Name.find((rec) => rec["@_ISO639-1Code"] === "fi")["#text"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getRatioNumber = (recordTypeData: any) => {
    if (recordTypeData.RatioNumber === "") {
      return null;
    }
    return Number(recordTypeData.RatioNumber);
  };
}
