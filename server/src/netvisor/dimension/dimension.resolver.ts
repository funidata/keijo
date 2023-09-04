import { Query, Resolver } from "@nestjs/graphql";
import { DimensionService } from "./dimension.service";

@Resolver()
export class DimensionResolver {
  constructor(private dimensionService: DimensionService) {}

  @Query(() => [String])
  async findDimensionNames(): Promise<string[]> {
    return this.dimensionService.findDimensionNames();
  }
}
