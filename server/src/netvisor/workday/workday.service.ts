import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import Utc from "dayjs/plugin/utc";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import {
  GetWorkdaysNvSchema,
  getWorkdaysNvArrays,
} from "../netvisor-api/schema/get-workdays-nv.schema";
import { AddWorkdayEntryInput } from "./dto/add-workday-entry-input.dto";
import { Entry } from "./dto/entry.dto";
import { Workday } from "./dto/workday.dto";

dayjs.extend(Utc);

type WorkdayQuery = {
  employeeNumber: number;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
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

  async addWorkdayEntry(employeeNumber: number, entry: AddWorkdayEntryInput): Promise<Entry> {
    await this.netvisorApiService.post(NetvisorEndpoints.POST_WORKDAY, {
      root: {
        workday: {
          date: {
            "#text": dayjs(entry.date).format("YYYY-MM-DD"),
            "@_method": "increment",
          },
          employeeidentifier: {
            "#text": employeeNumber,
            "@_type": "number",
          },
          workdayhour: {
            hours: entry.duration,
            collectorratio: {
              "#text": entry.recordTypeRatioNumber,
              "@_type": "number",
            },
            acceptancestatus: "confirmed",
            description: "",
          },
        },
      },
    });

    return {
      entryType: "",
      duration: entry.duration,
      dimensions: [],
    };
  }

  private toLocalWorkdays(apiResult: GetWorkdaysNvSchema): Workday[] {
    return apiResult.WorkDays.Workday.map((wd) => ({
      date: new Date(wd.Date),
      entries: wd.WorkdayHour.map((wdh) => ({
        duration: wdh.Hours,
        entryType: wdh.CollectorRatio,
        dimensions:
          wdh.Dimension?.map((dim) => ({
            name: dim.DimensionName,
            value: dim.DimensionItem,
          })) || [],
      })),
    }));
  }
}
