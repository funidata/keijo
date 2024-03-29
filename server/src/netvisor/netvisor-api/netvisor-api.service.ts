import { BadRequestException, Injectable } from "@nestjs/common";
import { XMLBuilder } from "fast-xml-parser";
import { AxiosService } from "../../axios/axios.service";
import { Logger } from "../../logger/logger";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { NetvisorEndpoints } from "./netvisor-endpoints.enum";
import fixUndefinedArrays from "./xml/fix-undefined-arrays";
import { XmlParserService } from "./xml/xml-parser.service";

@Injectable()
export class NetvisorApiService {
  constructor(
    private axiosService: AxiosService,
    private netvisorAuthService: NetvisorAuthService,
    private logger: Logger,
    private xmlParserService: XmlParserService,
  ) {
    logger.setContext(NetvisorApiService.name);
  }

  // FIXME: Type this properly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(
    endpoint: NetvisorEndpoints,
    arrayPaths: string[] = [],
    params = {},
  ): Promise<T> {
    const url = this.netvisorAuthService.getUrl(endpoint);
    const headers = this.netvisorAuthService.getAuthenticationHeaders(url, params);
    const res = await this.axiosService.get(url, { headers, params });

    const data = this.xmlParserService.parse(res.data, arrayPaths);

    if (data.Root.ResponseStatus.Status !== "OK") {
      const description = "Request to Netvisor API failed.";
      const responseStatus = data.Root.ResponseStatus.Status[1];
      this.logger.error({ message: `${description} [${responseStatus}]` });
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

    const res = await this.axiosService.post(url, xml, { headers });
    const resultData = this.xmlParserService.parse(res.data);

    if (resultData.Root.ResponseStatus.Status !== "OK") {
      const description = "Request to Netvisor API failed.";
      const responseStatus = resultData.Root.ResponseStatus.Status[1];
      this.logger.error({ message: `${description} [${responseStatus}]` });
      throw new BadRequestException(description);
    }

    return resultData;
  }
}
