import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EmployeeNumber } from "../decorators/employee-number.decorator";
import { OverviewZone, OverviewZoneInput } from "./dto/overview-config.dto";
import { OverviewConfigService } from "./overview-config.service";

@Resolver(() => OverviewZone)
export class OverviewConfigResolver {
  constructor(private overviewConfigService: OverviewConfigService) {}

  @Query(() => [OverviewZone])
  async getMyOverviewConfig(@EmployeeNumber() employeeNumber: number) {
    return this.overviewConfigService.findOneByEmployeeNumber(employeeNumber);
  }

  @Mutation(() => [OverviewZone])
  async updateMyOverviewConfig(
    @EmployeeNumber() employeeNumber: number,
    @Args("config", { type: () => [OverviewZoneInput] }) config: OverviewZoneInput[],
  ) {
    return this.overviewConfigService.update(employeeNumber, config);
  }
}
