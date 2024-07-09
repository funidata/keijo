import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { useContainer } from "class-validator";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { createSession } from "./jira/session-setup";
import { AppLogger } from "./logger/app-logger";

const options =
  process.env.NODE_ENV === "development"
    ? {
        cors: {
          origin: process.env.CORS_ORIGIN,
          credentials: true,
        },
      }
    : {};

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    ...options,
  });
  const configService = app.get(ConfigService);
  app.useLogger(new AppLogger(configService));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());

  // express-session setup.
  app.set("trust proxy", configService.config.trustProxyIps);
  app.use(createSession(configService));
  app.use(cookieParser());

  await app.listen(configService.config.port);
})();
