import { Query, Resolver } from "@nestjs/graphql";
import dayjs from "dayjs";
import { Workday } from "./workday.dto";
import { WorkdayService } from "./workday.service";

@Resolver()
export class WorkdayResolver {
  constructor(private workdayService: WorkdayService) {}

  @Query(() => [Workday])
  async findWorkdays(): Promise<Workday[]> {
    const res = await this.workdayService.findMany({
      employeeNumber: "123",
      start: dayjs("2023-01-01"),
      end: dayjs(),
    });
    console.log(res);

    // TODO: Refactor conversion.
    return res.map((wd) => ({
      date: new Date(wd.Date),
      entries: [
        {
          duration: Number(wd.WorkdayHour.Hours) || Number(wd.WorkdayHour.Hours.replace(",", ".")),
          entryType: wd.WorkdayHour.CollectorRatio,
        },
      ],
    }));
  }
}
