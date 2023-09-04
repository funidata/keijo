import { Injectable } from "@nestjs/common";
import { DimensionListNvSchema } from "../netvisor-api/schema/dimension-list-nv.schema";
import { DimensionCacheService } from "./dimension-cache.service";

@Injectable()
export class DimensionService {
  constructor(private dimensionCacheService: DimensionCacheService) {}

  async findAllDimensions(): Promise<DimensionListNvSchema> {
    const data = await this.dimensionCacheService.getCachedDimensionData();
    return data.Root;
  }

  // TODO: This isn't necessary once we have better resolver for Dimensions with values etc.
  async findDimensionNames(): Promise<string[]> {
    const dimensions = await this.findAllDimensions();
    const dimensionNames = dimensions.DimensionNameList.DimensionName.map((dim) => dim.Name);
    return dimensionNames;
  }
}
