import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { CacheModule } from "./cache/cache.module";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { appGuards } from "./guards/app-guards";
import { LoggerModule } from "./logger/logger.module";
import { NetvisorModule } from "./netvisor/netvisor.module";
import { SessionModule } from "./session/session.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      exclude: ["/graphql/(.*)"],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: ({ config }: ConfigService) => ({
        playground: config.inDev,
        autoSchemaFile: true,
      }),
    }),
    CacheModule,
    ConfigModule,
    LoggerModule,
    NetvisorModule,
    SessionModule,
  ],
  providers: [...appGuards],
})
export class AppModule {}
