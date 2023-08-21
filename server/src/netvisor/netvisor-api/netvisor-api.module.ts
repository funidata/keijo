import { Module } from "@nestjs/common";
import { NetvisorApiService } from "./netvisor-api.service";
import { NetvisorAuthService } from "./netvisor-auth.service";

@Module({
  providers: [NetvisorApiService, NetvisorAuthService],
  exports: [NetvisorApiService, NetvisorAuthService],
})
export class NetvisorApiModule {}
