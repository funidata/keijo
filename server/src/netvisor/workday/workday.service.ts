import { Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import { DimensionSchema } from "../netvisor-api/schema/dimension.schema";
import {
  GetWorkdaysNvSchema,
  getWorkdaysNvArrays,
} from "../netvisor-api/schema/get-workdays-nv.schema";
import { EntryDimensions } from "./dto/entry.dto";
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
  async findMany({ employeeNumber, start, end }: WorkdayQuery): Promise<Workday[]> {
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
        description: wdh.Description,
        entryType: wdh.CollectorRatio["#text"],
        ...this.transformDimensionsToObject(wdh.Dimension),
      })),
    }));
  }

  private getDimension(key: string, dimensions: DimensionSchema[]): string | null {
    return dimensions.find((dim) => dim.DimensionName === key)?.DimensionItem || null;
  }

  private transformDimensionsToObject(dimensions: DimensionSchema[] = []): EntryDimensions {
    return {
      product: this.getDimension("1 Tuote", dimensions),
      activity: this.getDimension("2 Toiminto", dimensions),
      issue: this.getDimension("3 Tiketti", dimensions),
      client: this.getDimension("4 Asiakas", dimensions),
    };
  }
}
