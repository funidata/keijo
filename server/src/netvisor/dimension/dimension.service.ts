import { Injectable } from "@nestjs/common";
import { DimensionCacheService } from "./dimension-cache.service";
import { DimensionOptions } from "./dto/dimension-options.dto";
import { Dimension } from "./dto/dimension.dto";

@Injectable()
export class DimensionService {
  constructor(private dimensionCacheService: DimensionCacheService) {}

  async findDimensionOptions(): Promise<DimensionOptions> {
    const dimensions = await this.findAllDimensions();
    const dimensionByName = (name: string) =>
      dimensions.find((dim) => dim.name === name)?.options || [];

    return {
      product: dimensionByName("1 Tuote"),
      activity: dimensionByName("2 Toiminto"),
      issue: dimensionByName("3 Tiketti"),
      client: dimensionByName("4 Asiakas"),
    };
  }

  async findAllDimensions(): Promise<Dimension[]> {
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
