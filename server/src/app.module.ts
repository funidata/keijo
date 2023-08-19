import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
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
    ConfigModule,
    NetvisorModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
