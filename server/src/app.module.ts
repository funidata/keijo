import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { CustomCacheModule } from "./cache.module";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { HeadersGuard } from "./guards/headers.guard";
import { LoggerModule } from "./logger/logger.module";
import { NetvisorModule } from "./netvisor/netvisor.module";

// Serve frontend files only in production.
const productionOnlyModules =
  process.env.NODE_ENV === "production"
    ? [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, "..", "public"),
          exclude: ["/graphql/(.*)"],
        }),
      ]
    : [];

@Module({
  imports: [
    ...productionOnlyModules,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: ({ config }: ConfigService) => ({
        playground: config.inDev,
        autoSchemaFile: true,
      }),
    }),
    CustomCacheModule,
    ConfigModule,
    LoggerModule,
    NetvisorModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: HeadersGuard,
    },
  ],
})
export class AppModule {}
