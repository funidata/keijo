/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { XMLBuilder } from "fast-xml-parser";
import { AppLogger } from "../../logger/app-logger";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { NetvisorEndpoints } from "./netvisor-endpoints.enum";
import fixUndefinedArrays from "./xml/fix-undefined-arrays";
import { XmlParserService } from "./xml/xml-parser.service";

@Injectable()
export class NetvisorApiService {
  constructor(
    private netvisorAuthService: NetvisorAuthService,
    private logger: AppLogger,
    private xmlParserService: XmlParserService,
  ) {
    logger.setContext(NetvisorApiService.name);
  }

  // FIXME: Type this properly.
  async get<T = any>(
    endpoint: NetvisorEndpoints,
    arrayPaths: string[] = [],
    params = {},
  ): Promise<T> {
    const url = this.netvisorAuthService.getUrl(endpoint);
    const headers = this.netvisorAuthService.getAuthenticationHeaders(url, params);
    const res = await this.loggedGet(url, { headers, params });

    const data = this.xmlParserService.parse(res.data, arrayPaths);

    if (data.Root.ResponseStatus.Status !== "OK") {
      const description = "Request to Netvisor API failed.";
      const responseStatus = data.Root.ResponseStatus.Status[1];
      this.logger.error({ description, responseStatus });
      throw new BadRequestException(description);
    }

    const fixedData = fixUndefinedArrays(data, arrayPaths);
    return fixedData;
  }

  async post(endpoint: NetvisorEndpoints, data: object): Promise<object> {
    const url = this.netvisorAuthService.getUrl(endpoint);
    const headers = this.netvisorAuthService.getAuthenticationHeaders(url);

    const builder = new XMLBuilder({ ignoreAttributes: false });
    const xml = builder.build(data);

    const res = await this.loggedPost(url, xml, { headers });
    const resultData = this.xmlParserService.parse(res.data);

    if (resultData.Root.ResponseStatus.Status !== "OK") {
      const description = "Request to Netvisor API failed.";
      const responseStatus = resultData.Root.ResponseStatus.Status[1];
      this.logger.error({ description, responseStatus });
      throw new BadRequestException(description);
    }

    return resultData;
  }

  private async loggedGet<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const description = "GET request to NV API.";
    this.logger.audit({ description, url, config });
    return axios.get<T, R, D>(url, config);
  }

  private loggedPost<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const description = "POST request to NV API.";
    this.logger.audit({ description, url, config, data });
    return axios.post<T, R, D>(url, data, config);
  }
}
