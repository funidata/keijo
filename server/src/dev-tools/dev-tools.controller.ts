import { Controller, Get, Query } from "@nestjs/common";
import { BypassHeadersGuard } from "../decorators/bypass-headers-guard.decorator";
import { DevToolsService } from "./dev-tools.service";

@Controller("dev")
export class DevToolsController {
  constructor(private devToolsService: DevToolsService) {}

  @Get("reset")
  @BypassHeadersGuard()
  async reset(@Query("id") id: string) {
    return this.devToolsService.reset(Number(id));
  }
}
