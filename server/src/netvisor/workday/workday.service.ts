import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import Utc from "dayjs/plugin/utc";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";

dayjs.extend(Utc);

type WorkdayQuery = {
  employeeNumber: string;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
};

@Injectable()
export class WorkdayService {
  constructor(private netvisorApiService: NetvisorApiService) {}

  async getWorkdays({ employeeNumber, start, end }: WorkdayQuery) {
    const params = {
      employeenumber: employeeNumber,
      workhourstartdate: start.format("YYYY-MM-DD"),
      workhourenddate: end.format("YYYY-MM-DD"),
    };

    const data = await this.netvisorApiService.get(NetvisorEndpoints.GET_WORKDAYS, params);

    if (!data.Root.WorkDays) {
      return [];
    }

    if (!data.Root.WorkDays.Workday.length) {
      return [data.Root.WorkDays.Workday];
    }

    return data.Root.WorkDays.Workday;
  }
}
