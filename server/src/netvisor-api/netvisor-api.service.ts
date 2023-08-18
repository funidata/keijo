import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import Utc from "dayjs/plugin/utc";
import sha from "sha.js";
import { v4 as uuid } from "uuid";
import config from "../config";

dayjs.extend(Utc);

@Injectable()
export class NetvisorApiService {
  /**
   * Build headers required to authenticate requests to Netvisor API.
   */
  private getAuthenticationHeaders(endpointUrl: string) {
    const { customerId, customerKey, lang, organizationId, organizationKey, partnerId, sender } =
      config.netvisor;

    // ANSI datetime string.
    const timestamp = dayjs().utc().format("YYYY-MM-DD HH:mm:ss.SSS");

    // Transaction ID must be unique for every request.
    const transactionId = uuid();

    // Message Authentication Code as specified in Netvisor API docs.
    const hashable = [
      endpointUrl,
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
