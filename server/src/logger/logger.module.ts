import { Global, Module } from "@nestjs/common";
import { ApolloLogger } from "./apollo-logger";
import { Logger } from "./logger";

@Global()
@Module({ providers: [Logger, ApolloLogger], exports: [Logger] })
export class LoggerModule {}
