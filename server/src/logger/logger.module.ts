import { Global, Module } from "@nestjs/common";
import { ApolloLogger } from "./apollo-logger";
import { AppLogger } from "./app-logger";

@Global()
@Module({ providers: [AppLogger, ApolloLogger], exports: [AppLogger] })
export class LoggerModule {}
