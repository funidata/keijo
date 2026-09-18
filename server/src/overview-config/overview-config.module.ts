import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OverviewConfig } from "./overview-config.model";
import { OverviewConfigResolver } from "./overview-config.resolver";
import { OverviewConfigService } from "./overview-config.service";

@Module({
  imports: [TypeOrmModule.forFeature([OverviewConfig])],
  providers: [OverviewConfigService, OverviewConfigResolver],
  exports: [TypeOrmModule, OverviewConfigService],
})
export class OverviewConfigModule {}
