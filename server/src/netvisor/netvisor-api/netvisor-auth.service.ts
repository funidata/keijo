import { Injectable } from "@nestjs/common";
import sha from "sha.js";
import { v4 as uuid } from "uuid";
import { Config } from "../../config/config.schema";
import { ConfigService } from "../../config/config.service";
import dayjs from "../../config/dayjs";
import { NetvisorEndpoints } from "./netvisor-endpoints.enum";

@Injectable()
export class NetvisorAuthService {
  private config: Config;

  constructor(configService: ConfigService) {
    this.config = configService.config;
  }

  getUrl(endpoint: NetvisorEndpoints): string {
    return [this.config.netvisor.host, endpoint].join("/");
  }

  /**
   * Build headers required to authenticate requests to Netvisor API.
   */
  getAuthenticationHeaders(endpointUrl: string, params = {}) {
    const { customerId, customerKey, lang, organizationId, organizationKey, partnerId, sender } =
      this.config.netvisor;

    const urlParams = Object.entries(params)
      .map(([key, val]) => [key, val].join("="))
      .join("&");
    const urlWithParams = urlParams ? [endpointUrl, urlParams].join("?") : endpointUrl;

    // ANSI datetime string.
    const time = dayjs();
    const timestamp = time.utc().format("YYYY-MM-DD HH:mm:ss.SSS");
    const timestampUnix = time.unix();

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
      timestampUnix,
      customerKey,
      organizationKey,
    ].join("&");


    // TODO
    const mac = sha("SHA256").update(hashable).digest("hex");

    const headers = {
      "X-Netvisor-Authentication-Sender": sender,
      "X-Netvisor-Authentication-CustomerId": customerId,
      "X-Netvisor-Authentication-PartnerId": partnerId,
      "X-Netvisor-Authentication-TimestampUnix": timestampUnix,
      "X-Netvisor-Authentication-Timestamp": timestamp,
      "X-Netvisor-Authentication-TransactionId": transactionId,
      "X-Netvisor-Interface-Language": lang,
      "X-Netvisor-Organisation-ID": organizationId,
      "X-Netvisor-Authentication-MAC": mac,
      "X-Netvisor-Authentication-MACHashCalculationAlgorithm": "HMACSHA256",
      "X-Netvisor-Authentication-UseHTTPResponseStatusCodes": 1,
    };

    return headers;
  }
}
