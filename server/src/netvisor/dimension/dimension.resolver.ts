import { Query, Resolver } from "@nestjs/graphql";
import { DimensionService } from "./dimension.service";
import { Dimension } from "./dto/dimension.dto";

@Resolver()
export class DimensionResolver {
  constructor(private dimensionService: DimensionService) {}

  @Query(() => [Dimension])
  async findDimensions(): Promise<Dimension> {
    return this.dimensionService.findAllDimensions();
  }

  @Query(() => [String])
  async findDimensionNames(): Promise<string[]> {
    return this.dimensionService.findDimensionNames();
  }
}
