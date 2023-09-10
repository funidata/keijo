import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import dayjs from "dayjs";
import { EmployeeNumber } from "../../decorators/employee-number.decorator";
import { AddWorkdayEntryInput } from "./dto/add-workday-entry-input.dto";
import { Entry } from "./dto/entry.dto";
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

  @Mutation(() => Entry)
  async addWorkdayEntry(
    @EmployeeNumber() employeeNumber: number,
    @Args("entry") entry: AddWorkdayEntryInput,
  ) {
    console.log(employeeNumber);
    console.log(entry);
  }
}
