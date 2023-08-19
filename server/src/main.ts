import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";

(async () => {
  const app = await NestFactory.create(AppModule);
  const {
    config: { port },
  } = app.get(ConfigService);
  await app.listen(port);
})();
