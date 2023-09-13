import { Module } from "@nestjs/common";
import { NetvisorApiService } from "./netvisor-api.service";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { XmlParserService } from "./xml/xml-parser.service";

@Module({
  providers: [NetvisorApiService, NetvisorAuthService, XmlParserService],
  exports: [NetvisorApiService, NetvisorAuthService, XmlParserService],
})
export class NetvisorApiModule {}
