import { Module } from "@nestjs/common";
import { NetvisorApiService } from "./netvisor-api.service";
import { NetvisorAuthService } from "./netvisor-auth.service";
import { NetvisorResolver } from "./netvisor.resolver";

/**
 * Integration with Netvisor XML API.
 */
@Module({
  providers: [NetvisorApiService, NetvisorAuthService, NetvisorResolver],
  exports: [NetvisorApiService],
})
export class NetvisorModule {}
