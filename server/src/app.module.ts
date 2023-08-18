import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppController } from "./app.controller";
import config from "./config";
import { NetvisorApiModule } from "./netvisor-api/netvisor-api.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: config.clientPath,
      exclude: ["/api/(.*)"],
    }),
    NetvisorApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
