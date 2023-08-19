import { Injectable } from "@nestjs/common";
import axios from "axios";
import dayjs from "dayjs";
import Utc from "dayjs/plugin/utc";
import { NetvisorAuthService } from "./netvisor-auth.service";

dayjs.extend(Utc);

type WorkdayQuery = {
  employeeNumber: string;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
};

@Injectable()
export class NetvisorApiService {
  constructor(private netvisorAuthService: NetvisorAuthService) {}

  async getWorkdays({ employeeNumber, start, end }: WorkdayQuery) {
    const params = {
      employeenumber: employeeNumber,
      workhourstartdate: start.format("YYYY-MM-DD"),
      workhourenddate: end.format("YYYY-MM-DD"),
    };
    const url = this.netvisorAuthService.getUrl("getworkdays.nv");
    const headers = this.netvisorAuthService.getAuthenticationHeaders(url, params);
    const res = await axios.get(url, { headers, params });
    return res.data;
  }
}
