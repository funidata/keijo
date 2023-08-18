import { Module } from "@nestjs/common";
import { NetvisorApiService } from "./netvisor-api.service";

/**
 * Integration with Netvisor XML API.
 */
@Module({ providers: [NetvisorApiService], exports: [NetvisorApiService] })
export class NetvisorApiModule {}
