import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { BypassHeadersGuard } from "../decorators/bypass-headers-guard.decorator";

@Controller()
export class SessionController {
  @BypassHeadersGuard()
  @Get("session-status")
  getSessionStatus(@Req() request: Request) {
    return request.headers;
  }
}
