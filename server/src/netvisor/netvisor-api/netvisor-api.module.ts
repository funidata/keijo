import { Module } from "@nestjs/common";
import { AxiosModule } from "../../axios/axios.module";
import { NetvisorApiService } from "./netvisor-api.service";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { XmlParserService } from "./xml/xml-parser.service";

@Module({
  imports: [AxiosModule],
  providers: [NetvisorApiService, NetvisorAuthService, XmlParserService],
  exports: [NetvisorApiService, NetvisorAuthService, XmlParserService, AxiosModule],
})
export class NetvisorApiModule {}
