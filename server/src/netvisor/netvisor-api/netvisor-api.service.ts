import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { XMLBuilder } from "fast-xml-parser";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { NetvisorEndpoints } from "./netvisor-endpoints.enum";
import fixUndefinedArrays from "./xml/fix-undefined-arrays";
import { NetvisorXmlParser } from "./xml/netvisor-xml-parser";

@Injectable()
export class NetvisorApiService {
  private readonly logger = new Logger(NetvisorApiService.name);

  constructor(private netvisorAuthService: NetvisorAuthService) {}

  // FIXME: Type this properly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(
    endpoint: NetvisorEndpoints,
    arrayPaths: string[] = [],
    params = {},
  ): Promise<T> {
    const url = this.netvisorAuthService.getUrl(endpoint);
    const headers = this.netvisorAuthService.getAuthenticationHeaders(url, params);
    const res = await axios.get(url, { headers, params });

    const data = new NetvisorXmlParser(arrayPaths).parse(res.data);

    if (data.Root.ResponseStatus.Status !== "OK") {
      const message = "Request to Netvisor API failed.";
      const description = data.Root.ResponseStatus.Status[1];
      this.logger.error(message, description);
      throw new BadRequestException(message, description);
    }

    const fixedData = fixUndefinedArrays(data, arrayPaths);
    return fixedData;
  }

  async post(endpoint: NetvisorEndpoints, data: object): Promise<object> {
    const url = this.netvisorAuthService.getUrl(endpoint);
    const headers = this.netvisorAuthService.getAuthenticationHeaders(url);

    const builder = new XMLBuilder({ ignoreAttributes: false });
    const xml = builder.build(data);

    const res = await axios.post(url, xml, { headers });
    const resultData = new NetvisorXmlParser().parse(res.data);

    if (resultData.Root.ResponseStatus.Status !== "OK") {
      const message = "Request to Netvisor API failed.";
      const description = resultData.Root.ResponseStatus.Status[1];
      this.logger.error(message, description);
      throw new BadRequestException(message, description);
    }

    return resultData;
  }
}
