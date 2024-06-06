import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "../config/config.service";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { config } = this.configService;
    const { database } = config;

    return {
      type: "postgres",
      host: database.url,
      port: database.port,
      username: database.username,
      password: database.password,
      database: database.name,
      entities: [],
      synchronize: config.inDev,
    };
  }
}
