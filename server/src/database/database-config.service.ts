import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "../config/config.service";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { config } = this.configService;
    const { database } = config;
    const { host, name, password, port, username, ssl } = database;

    return {
      type: "postgres",
      host,
      port,
      username,
      password,
      database: name,
      autoLoadEntities: true,
      synchronize: config.inDev,
      /**
       * If DATABASE_SSL_MODE env var is true, use sslmode=no-verify. Other SSL modes are
       * not supported.
       * See https://github.com/brianc/node-postgres/tree/master/packages/pg-connection-string#tcp-connections
       */
      ssl: ssl ? { rejectUnauthorized: false } : false,
    };
  }
}
