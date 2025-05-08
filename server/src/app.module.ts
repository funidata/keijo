import { ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { CacheModule } from "./cache/cache.module";
import { ConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { DevToolsModule } from "./dev-tools/dev-tools.module";
import graphQlModuleConfig from "./graphql-module-config";
import { appGuards } from "./guards/app-guards";
import { JiraModule } from "./jira/jira.module";
import { LoggerModule } from "./logger/logger.module";
import { NetvisorModule } from "./netvisor/netvisor.module";
import { SessionModule } from "./session/session.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";

const inDev = process.env.NODE_ENV === "development";
const inCi = process.env.CI === "true";
const devEnvImports = inDev || inCi ? [DevToolsModule] : [];

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      exclude: ["/graphql/{*_}"],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleConfig),
    CacheModule,
    ConfigModule,
    LoggerModule,
    NetvisorModule,
    SessionModule,
    DatabaseModule,
    UserSettingsModule,
    JiraModule,
    ...devEnvImports,
  ],
  providers: [...appGuards],
})
export class AppModule {}
