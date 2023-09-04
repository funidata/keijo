import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
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
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.config.netvisor.cacheTtl * 1000,
      }),
    }),
    ConfigModule,
    NetvisorModule,
  ],
})
export class AppModule {}
