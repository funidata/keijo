import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { AppLogger } from "./logger/app-logger";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

const options =
  process.env.NODE_ENV === "development"
    ? { cors: { origin: "http://localhost:3000", credentials: true } }
    : {};

(async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, ...options });
  const configService = app.get(ConfigService);
  app.useLogger(new AppLogger(configService));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    // TODO: change default store to pg store
    session({
      name: configService.config.session.name,
      secret: configService.config.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  await app.listen(configService.config.port);
})();
