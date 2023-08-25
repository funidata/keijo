import { Args, Query, Resolver } from "@nestjs/graphql";
import dayjs from "dayjs";
import { EmployeeNumber } from "../../decorators/employee-number.decorator";
import { FindWorkdaysQuery } from "./dto/find-workdays-query.dto";
import { Workday } from "./dto/workday.dto";
import { WorkdayService } from "./workday.service";

@Resolver()
export class WorkdayResolver {
  constructor(private workdayService: WorkdayService) {}

  @Query(() => [Workday])
  async findWorkdays(
    @EmployeeNumber() employeeNumber: number,
    @Args("query") query: FindWorkdaysQuery,
  ): Promise<Workday[]> {
    return await this.workdayService.findMany({
      employeeNumber,
      start: dayjs(query.start),
      end: dayjs(query.end),
    });
  }
}
