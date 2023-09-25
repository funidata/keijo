import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import dayjs from "../../config/dayjs";
import { EmployeeNumber } from "../../decorators/employee-number.decorator";
import { Eppn } from "../../decorators/eppn.decorator";
import { AddWorkdayEntryInput } from "./dto/add-workday-entry-input.dto";
import { FindWorkdaysInput } from "./dto/find-workdays-query.dto";
import { RemoveWorkdayEntryInput } from "./dto/remove-workday-entry-input.dto";
import { Workday } from "./dto/workday.dto";
import { EntryService } from "./entry.service";
import { WorkdayService } from "./workday.service";

@Resolver()
export class WorkdayResolver {
  constructor(
    private workdayService: WorkdayService,
    private entryService: EntryService,
  ) {}

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
    @Eppn() eppn: string,
    @Args("entry") entry: AddWorkdayEntryInput,
  ) {
    await this.entryService.addWorkdayEntry(employeeNumber, eppn, entry);
    // NV API does not return any data about the created object so it does not make
    // sense for us to return anything, as it would be just guessing. (E.g., NV API might
    // round given duration resulting in different durations between NV and a client.)
    return "OK";
  }

  @Mutation(() => String)
  async removeWorkdayEntry(
    @EmployeeNumber() employeeNumber: number,
    @Eppn() eppn: string,
    @Args("entry") entry: RemoveWorkdayEntryInput,
  ) {
    await this.entryService.remove(employeeNumber, eppn, entry.key, dayjs(entry.date));
    return "OK";
  }
}
