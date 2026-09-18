import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OverviewConfig } from "./overview-config.model";

@Module({
  imports: [TypeOrmModule.forFeature([OverviewConfig])],
  exports: [TypeOrmModule],
})
export class OverviewConfigModule {}
