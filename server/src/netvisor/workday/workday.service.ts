import { Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import {
  GetWorkdaysNvSchema,
  getWorkdaysNvArrays,
} from "../netvisor-api/schema/get-workdays-nv.schema";
import { Workday } from "./dto/workday.dto";

type WorkdayQuery = {
  employeeNumber: number;
  start: Dayjs;
  end: Dayjs;
};

@Injectable()
export class WorkdayService {
  constructor(private netvisorApiService: NetvisorApiService) {}

  // TODO: Add validation (pipe?)
  async findMany({ employeeNumber, start, end }: WorkdayQuery) {
    const params = {
      employeenumber: employeeNumber,
      workhourstartdate: start.format("YYYY-MM-DD"),
      workhourenddate: end.format("YYYY-MM-DD"),
    };

    const data = await this.netvisorApiService.get(
      NetvisorEndpoints.GET_WORKDAYS,
      getWorkdaysNvArrays,
      params,
    );

    return this.toLocalWorkdays(data.Root);
  }

  private toLocalWorkdays(apiResult: GetWorkdaysNvSchema): Workday[] {
    return apiResult.WorkDays.Workday.map((wd) => ({
      date: new Date(wd.Date),
      entries: wd.WorkdayHour.map((wdh) => ({
        key: wdh["@_netvisorkey"],
        duration: wdh.Hours,
        entryType: wdh.CollectorRatio["#text"],
        dimensions:
          wdh.Dimension?.map((dim) => ({
            name: dim.DimensionName,
            value: dim.DimensionItem,
          })) || [],
      })),
    }));
  }
}
