import { Injectable } from "@nestjs/common";
import axios from "axios";
import dayjs from "dayjs";
import Utc from "dayjs/plugin/utc";
import sha from "sha.js";
import { v4 as uuid } from "uuid";
import { Config } from "../config/config.schema";
import { ConfigService } from "../config/config.service";

dayjs.extend(Utc);

type WorkdayQuery = {
  employeeNumber: string;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
};

@Injectable()
export class NetvisorApiService {
  private config: Config;
  constructor(configService: ConfigService) {
    this.config = configService.config;
  }

  async getWorkdays({ employeeNumber, start, end }: WorkdayQuery) {
    const params = {
      employeenumber: employeeNumber,
      workhourstartdate: start.format("YYYY-MM-DD"),
      workhourenddate: end.format("YYYY-MM-DD"),
    };
    const url = this.getUrl("getworkdays.nv");
    const headers = this.getAuthenticationHeaders(url, params);
    const res = await axios.get(url, { headers, params });
    return res.data;
  }

  private getUrl(endpoint: string): string {
    return [this.config.netvisor.host, endpoint].join("/");
  }

  /**
   * Build headers required to authenticate requests to Netvisor API.
   */
  private getAuthenticationHeaders(endpointUrl: string, params?: unknown) {
    const { customerId, customerKey, lang, organizationId, organizationKey, partnerId, sender } =
      this.config.netvisor;

    const urlParams = Object.entries(params || {})
      .map(([key, val]) => [key, val].join("="))
      .join("&");
    const urlWithParams = urlParams ? [endpointUrl, urlParams].join("?") : endpointUrl;

    // ANSI datetime string.
    const timestamp = dayjs().utc().format("YYYY-MM-DD HH:mm:ss.SSS");

    // Transaction ID must be unique for every request.
    const transactionId = uuid();

    // Message Authentication Code as specified in Netvisor API docs.
    const hashable = [
      urlWithParams,
      sender,
      customerId,
      timestamp,
      // Note that this is specified as uppercase string in the docs but only lowercase string actually works...
      lang,
      organizationId,
      transactionId,
      customerKey,
      organizationKey,
    ].join("&");

    const mac = sha("SHA256").update(hashable).digest("hex");

    const headers = {
      "X-Netvisor-Authentication-Sender": sender,
      "X-Netvisor-Authentication-CustomerId": customerId,
      "X-Netvisor-Authentication-PartnerId": partnerId,
      "X-Netvisor-Authentication-Timestamp": timestamp,
      "X-Netvisor-Authentication-TransactionId": transactionId,
      "X-Netvisor-Interface-Language": lang,
      "X-Netvisor-Organisation-ID": organizationId,
      "X-Netvisor-Authentication-MAC": mac,
      "X-Netvisor-Authentication-MACHashCalculationAlgorithm": "SHA256",
    };

    return headers;
  }
}
