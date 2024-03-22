import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { AppLogger } from "./logger/app-logger";

const options = process.env.NODE_ENV === "development" ? { cors: { origin: "*" } } : {};

(async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, ...options });
  const configService = app.get(ConfigService);
  app.useLogger(new AppLogger(configService));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.config.port);
})();
