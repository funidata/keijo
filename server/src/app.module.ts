import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppController } from "./app.controller";
import config from "./config";
import { ConfigModule } from "./config/config.module";
import { NetvisorApiModule } from "./netvisor-api/netvisor-api.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: config.clientPath,
      exclude: ["/api/(.*)"],
    }),
    ConfigModule,
    NetvisorApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
