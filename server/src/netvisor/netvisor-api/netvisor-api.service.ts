import { Injectable } from "@nestjs/common";
import axios from "axios";
import dayjs from "dayjs";
import Utc from "dayjs/plugin/utc";
import { XMLParser } from "fast-xml-parser";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { NetvisorEndpoints } from "./netvisor-endpoints.enum";

dayjs.extend(Utc);

@Injectable()
export class NetvisorApiService {
  constructor(private netvisorAuthService: NetvisorAuthService) {}

  // FIXME: Type this properly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(endpoint: NetvisorEndpoints, params?: unknown): Promise<T> {
    const url = this.netvisorAuthService.getUrl(endpoint);
    const headers = this.netvisorAuthService.getAuthenticationHeaders(url, params);
    const res = await axios.get(url, { headers, params });
    return new XMLParser().parse(res.data);
  }
}
