import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";

const options = process.env.NODE_ENV === "development" ? { cors: { origin: "*" } } : {};

(async () => {
  const app = await NestFactory.create(AppModule, options);
  const {
    config: { port },
  } = app.get(ConfigService);
  await app.listen(port);
})();
