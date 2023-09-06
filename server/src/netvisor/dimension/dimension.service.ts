import { Injectable } from "@nestjs/common";
import { DimensionCacheService } from "./dimension-cache.service";
import { Dimension } from "./dto/dimension.dto";

@Injectable()
export class DimensionService {
  constructor(private dimensionCacheService: DimensionCacheService) {}

  async findAllDimensions(): Promise<Dimension> {
    const data = await this.dimensionCacheService.getCachedDimensionData();

    return data.Root.DimensionNameList.DimensionName.map((dim) => ({
      name: dim.Name,
      options: this.buildOptions(dim),
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildOptions = (dimension: any) => {
    const details = dimension.DimensionDetails;
    if (details === "") {
      return [];
    }

    if (!Array.isArray(details.DimensionDetail)) {
      return [details.DimensionDetail.Name];
    }

    return details.DimensionDetail.map((det) => det.Name);
  };
}
