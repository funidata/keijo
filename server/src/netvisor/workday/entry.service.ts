import { Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";
import dayjs from "../../config/dayjs";
import { Logger } from "../../logger/logger";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import { AddWorkdayEntryInput } from "./dto/add-workday-entry-input.dto";
import { Entry } from "./dto/entry.dto";
import { WorkdayService } from "./workday.service";

@Injectable()
export class EntryService {
  constructor(
    private netvisorApiService: NetvisorApiService,
    private workdayService: WorkdayService,
    private logger: Logger,
  ) {
    logger.setContext(EntryService.name);
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

  /**
   * Find one workday entry.
   *
   * NV API does not allow querying for workday entries with just the key. Therefore,
   * date is also required.
   */
  async findOne(key: string, date: Dayjs, employeeNumber: number): Promise<Entry | undefined> {
    const workdays = await this.workdayService.findMany({ employeeNumber, start: date, end: date });
    return workdays[0]?.entries.find((entry) => entry.key === key);
  }
}
