import { Query, Resolver } from "@nestjs/graphql";
import dayjs from "dayjs";
import { EmployeeNumber } from "../../decorators/employee-number.decorator";
import { Workday } from "./dto/workday.dto";
import { WorkdayService } from "./workday.service";

@Resolver()
export class WorkdayResolver {
  constructor(private workdayService: WorkdayService) {}

  @Query(() => [Workday])
  async findWorkdays(@EmployeeNumber() employeeNumber: number): Promise<Workday[]> {
    return await this.workdayService.findMany({
      employeeNumber,
      start: dayjs("2023-01-01"),
      end: dayjs("2023-08-15"),
    });
  }
}
