import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Dayjs } from "dayjs";
import config from "../../config/config";
import dayjs from "../../config/dayjs";
import { Logger } from "../../logger/logger";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import { AddWorkdayEntryInput } from "./dto/add-workday-entry-input.dto";
import { Entry } from "./dto/entry.dto";
import { WorkdayService } from "./workday.service";

// TODO: Refactor.
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
    const { duration, product, activity, issue, client } = entry;
    const { ratioNumber } = config.netvisor;
    const date = dayjs(entry.date).format("YYYY-MM-DD");

    this.logger.audit({
      operation: "addWorkdayEntry",
      employeeNumber,
      eppn,
      input: {
        date,
        duration,
        product,
        activity,
        issue,
        client,
        ratioNumber,
      },
    });

    const dimensions = [
      {
        dimensionname: "1 Tuote",
        dimensionitem: product,
      },
      {
        dimensionname: "2 Toiminto",
        dimensionitem: activity,
      },
      {
        dimensionname: "3 Tiketti",
        dimensionitem: issue,
      },
      {
        dimensionname: "4 Asiakas",
        dimensionitem: client,
      },
    ].filter((dim) => dim.dimensionitem);

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
              "#text": ratioNumber,
              "@_type": "number",
            },
            acceptancestatus: "confirmed",
            description: "",
            dimension: dimensions,
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

  /**
   * Remove one workday entry.
   *
   * NV API exposes only one endpoint to remove entries and it works by key only.
   * Therefore, we must first check that the given entry key belongs to the user who
   * made the request. For this, entry date is required, as workday entries cannot
   * be queried from NV API without it.
   */
  async remove(
    employeeNumber: number,
    eppn: string,
    entryKey: string,
    entryDate: Dayjs,
  ): Promise<void> {
    const entry = await this.findOne(entryKey, entryDate, employeeNumber);

    if (!entry) {
      const message = "Removing an entry failed because it could not be found from Netvisor.";
      this.logger.error(message);
      this.logger.audit({
        message,
        employeeNumber,
        eppn,
        input: { entryKey, date: entryDate.toISOString() },
      });
      throw new NotFoundException(message);
    }

    const res = await this.netvisorApiService.get(NetvisorEndpoints.DELETE_WORKDAYHOUR, [], {
      netvisorkey: entryKey,
    });

    if (res.Root.ResponseStatus.Status !== "OK") {
      const message = "Removing an entry failed with an unknown exception from NV API.";
      this.logger.error(message);
      this.logger.audit({
        message,
        employeeNumber,
        eppn,
        input: { entryKey, date: entryDate.toISOString() },
      });
      throw new BadRequestException(message);
    }

    this.logger.audit({
      message: "Removed an entry.",
      operation: "removeWorkdayEntry",
      employeeNumber,
      eppn,
      input: { entryKey, date: entryDate.toISOString() },
    });
  }
}
