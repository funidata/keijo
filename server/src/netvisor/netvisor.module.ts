import { Module } from "@nestjs/common";
import { NetvisorApiService } from "./netvisor-api.service";
import { NetvisorAuthService } from "./netvisor-auth.service";

/**
 * Integration with Netvisor XML API.
 */
@Module({ providers: [NetvisorApiService, NetvisorAuthService], exports: [NetvisorApiService] })
export class NetvisorModule {}
