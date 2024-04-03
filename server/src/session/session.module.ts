import { Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { SessionResolver } from "./session.resolver";
import { SessionService } from "./session.service";

@Module({
  providers: [SessionService, SessionResolver],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
