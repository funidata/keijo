import { Module } from "@nestjs/common";
import { SessionResolver } from "./session.resolver";
import { SessionService } from "./session.service";

@Module({
  providers: [SessionService, SessionResolver],
  exports: [SessionService],
})
export class SessionModule {}
