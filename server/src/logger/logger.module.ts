import { Global, Module } from "@nestjs/common";
import { ApolloLogger } from "./apollo-logger";
import { AppLogger } from "./app-logger";
import { Logger } from "./logger";

@Global()
@Module({
  providers: [AppLogger, ApolloLogger, Logger],
  exports: [AppLogger, Logger],
})
export class LoggerModule {}
