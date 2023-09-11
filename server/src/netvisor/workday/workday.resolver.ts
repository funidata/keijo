import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import dayjs from "../../config/dayjs";
import { EmployeeNumber } from "../../decorators/employee-number.decorator";
import { AddWorkdayEntryInput } from "./dto/add-workday-entry-input.dto";
import { FindWorkdaysInput } from "./dto/find-workdays-query.dto";
import { Workday } from "./dto/workday.dto";
import { WorkdayService } from "./workday.service";

@Resolver()
export class WorkdayResolver {
  constructor(private workdayService: WorkdayService) {}

  @Query(() => [Workday])
  async findWorkdays(
    @EmployeeNumber() employeeNumber: number,
    @Args("query") query: FindWorkdaysInput,
  ): Promise<Workday[]> {
    return await this.workdayService.findMany({
      employeeNumber,
      start: dayjs(query.start),
      end: dayjs(query.end),
    });
  }

  @Mutation(() => String)
  async addWorkdayEntry(
    @EmployeeNumber() employeeNumber: number,
    @Args("entry") entry: AddWorkdayEntryInput,
  ) {
    await this.workdayService.addWorkdayEntry(employeeNumber, entry);
    // NV API does not return any data about the created object so it does not make
    // sense for us to return anything, as it would be just guessing. (E.g., NV API might
    // round given duration resulting in different durations between NV and a client.)
    return "OK";
  }
}
