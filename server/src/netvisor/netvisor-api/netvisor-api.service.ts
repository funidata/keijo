import { Injectable } from "@nestjs/common";
import axios from "axios";
import dayjs from "dayjs";
import Utc from "dayjs/plugin/utc";
import { XMLParser } from "fast-xml-parser";
import { get, set } from "lodash";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { NetvisorEndpoints } from "./netvisor-endpoints.enum";
import { getWorkdaysNvArrays } from "./schema/get-workdays-nv.schema";

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

    const data = new XMLParser({
      isArray: (_, path) => {
        return getWorkdaysNvArrays.includes(path);
      },
    }).parse(res.data);

    // Despite `isArray` coercion, empty lists are still undefined.
    getWorkdaysNvArrays.forEach((path) => {
      if (get(data, path) === undefined) {
        set(data, path, []);
      }
    });

    return data;
  }
}
