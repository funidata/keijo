import session from "express-session";
import pgSession from "connect-pg-simple";
import pg from "pg";
import { ConfigService } from "../config/config.service";

export function createSession(configService: ConfigService) {
  const { username, password, host, port, name } = configService.config.database;
  const pgPool = new pg.Pool({
    database: name,
    user: username,
    password,
    host,
    port,
  });

  return session({
    store: new (pgSession(session))({
      pool: pgPool,
      createTableIfMissing: configService.config.inDev,
    }),
    name: configService.config.session.name,
    secret: configService.config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: !configService.config.inDev,
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    },
  });
}
