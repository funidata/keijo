import { Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";
import dayjs from "../../config/dayjs";
import { Logger } from "../../logger/logger";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import {
  GetWorkdaysNvSchema,
  getWorkdaysNvArrays,
} from "../netvisor-api/schema/get-workdays-nv.schema";
import { AddWorkdayEntryInput } from "./dto/add-workday-entry-input.dto";
import { Workday } from "./dto/workday.dto";

type WorkdayQuery = {
  employeeNumber: number;
  start: Dayjs;
  end: Dayjs;
};

@Injectable()
export class WorkdayService {
  constructor(
    private netvisorApiService: NetvisorApiService,
    private logger: Logger,
  ) {
    logger.setContext(WorkdayService.name);
  }

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

  async addWorkdayEntry(
    employeeNumber: number,
    eppn: string,
    entry: AddWorkdayEntryInput,
  ): Promise<void> {
    const { duration, dimensions, recordTypeRatioNumber } = entry;
    const date = dayjs(entry.date).format("YYYY-MM-DD");

    this.logger.audit({
      operation: "addWorkdayEntry",
      employeeNumber,
      eppn,
      input: {
        date,
        duration,
        dimensionNames: dimensions.map((dim) => dim.name),
        dimensionValues: dimensions.map((dim) => dim.value),
        ratioNumber: recordTypeRatioNumber,
      },
    });

    await this.netvisorApiService.post(NetvisorEndpoints.POST_WORKDAY, {
      root: {
        workday: {
          date: {
            "#text": date,
            "@_method": "increment",
          },
          employeeidentifier: {
            "#text": employeeNumber,
            "@_type": "number",
          },
          workdayhour: {
            hours: duration,
            collectorratio: {
              "#text": recordTypeRatioNumber,
              "@_type": "number",
            },
            acceptancestatus: "confirmed",
            description: "",
            dimension: dimensions.map((dim) => ({
              dimensionname: dim.name,
              dimensionitem: dim.value,
            })),
          },
        },
      },
    });
  }

  private toLocalWorkdays(apiResult: GetWorkdaysNvSchema): Workday[] {
    return apiResult.WorkDays.Workday.map((wd) => ({
      date: new Date(wd.Date),
      entries: wd.WorkdayHour.map((wdh) => ({
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
