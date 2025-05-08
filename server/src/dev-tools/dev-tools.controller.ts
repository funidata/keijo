import { Controller, Get } from "@nestjs/common";
import { BypassHeadersGuard } from "../decorators/bypass-headers-guard.decorator";
import { DevToolsService } from "./dev-tools.service";

@Controller("dev")
export class DevToolsController {
  constructor(private devToolsService: DevToolsService) {}

  @Get("reset")
  @BypassHeadersGuard()
  async reset() {
    await this.devToolsService.reset();
    return "OK";
  }
}
