import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { AppLogger } from "./logger/app-logger";
import cookieParser from "cookie-parser";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pg from "pg";

const options =
  process.env.NODE_ENV === "development"
    ? {
        cors: {
          origin: `http://localhost:${process.env.DEV_FRONTEND_PORT || 3000}`,
          credentials: true,
        },
      }
    : {};

(async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, ...options });
  const configService = app.get(ConfigService);
  app.useLogger(new AppLogger(configService));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());
  const { username, password, host, port, name } = configService.config.database;
  const pgPool = new pg.Pool({
    database: name,
    user: username,
    password,
    host,
    port,
  });
  app.use(
    session({
      store: new (pgSession(session))({
        pool: pgPool,
        createTableIfMissing: true,
      }),
      name: configService.config.session.name,
      secret: configService.config.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      },
    }),
  );
  app.use(cookieParser());
  await app.listen(configService.config.port);
})();
