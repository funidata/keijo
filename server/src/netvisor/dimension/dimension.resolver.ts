import { Query, Resolver } from "@nestjs/graphql";
import { DimensionService } from "./dimension.service";
import { DimensionOptions } from "./dto/dimension-options.dto";

@Resolver()
export class DimensionResolver {
  constructor(private dimensionService: DimensionService) {}

  @Query(() => DimensionOptions)
  async findDimensionOptions(): Promise<DimensionOptions> {
    return this.dimensionService.findDimensionOptions();
  }
}
