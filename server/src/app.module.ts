import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { ConfigModule } from "./config/config.module";
import { NetvisorModule } from "./netvisor/netvisor.module";

// Serve frontend files only in production.
const productionOnlyModules =
  process.env.NODE_ENV === "production"
    ? [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, "..", "public"),
          exclude: ["/api/(.*)"],
        }),
      ]
    : [];

@Module({
  imports: [...productionOnlyModules, ConfigModule, NetvisorModule],
  controllers: [AppController],
})
export class AppModule {}
