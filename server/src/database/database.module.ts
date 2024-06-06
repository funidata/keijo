import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "../config/config.module";
import { DatabaseConfigService } from "./database-config.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
