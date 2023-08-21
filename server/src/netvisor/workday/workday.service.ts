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

  // TODO: Add validation (pipe?)
  async findMany({ employeeNumber, start, end }: WorkdayQuery) {
    const params = {
      employeenumber: employeeNumber,
      workhourstartdate: start.format("YYYY-MM-DD"),
      workhourenddate: end.format("YYYY-MM-DD"),
    };

    const data = await this.netvisorApiService.get(NetvisorEndpoints.GET_WORKDAYS, params);
    console.dir(data.Root, { depth: null });

    // TODO: The two ifs below can probably be safely generalized. This behavior should be due to conversion from XML, not Netvisor API.
    if (!data.Root.WorkDays) {
      return [];
    }

    if (!data.Root.WorkDays.Workday.length) {
      return [data.Root.WorkDays.Workday];
    }

    // FIXME: `Date` must be converted to JS date.
    // FIXME: `WorkdayHour` needs the XML->JS array treatment.
    // FIXME: `WorkdayHour.Hours` must be converted properly; now integers are numbers and decimals strings.
    return data.Root.WorkDays.Workday;
  }
}
