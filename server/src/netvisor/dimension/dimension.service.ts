import { Injectable } from "@nestjs/common";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import { DimensionListNvSchema } from "../netvisor-api/schema/dimension-list-nv.schema";

@Injectable()
export class DimensionService {
  constructor(private netvisorApiService: NetvisorApiService) {}

  // FIXME: This should be cached to avoid spamming NV API.
  async findAllDimensions(): Promise<DimensionListNvSchema> {
    const data = await this.netvisorApiService.get(NetvisorEndpoints.GET_DIMENSIONS);
    return data.Root;
  }

  // TODO: This isn't necessary once we have better resolver for Dimensions with values etc.
  async findDimensionNames(): Promise<string[]> {
    const dimensions = await this.findAllDimensions();
    const dimensionNames = dimensions.DimensionNameList.DimensionName.map((dim) => dim.Name);
    return dimensionNames;
  }
}
