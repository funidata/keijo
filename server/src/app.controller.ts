import { Controller, Get } from "@nestjs/common";
import dayjs from "dayjs";
import { NetvisorApiService } from "./netvisor/netvisor-api.service";

@Controller("api")
export class AppController {
  constructor(private netvisorApiService: NetvisorApiService) {}

  @Get()
  async getHello() {
    // FIXME: For testing. Remove.
    return this.netvisorApiService.getWorkdays({
      employeeNumber: "123",
      start: dayjs("2023-01-01"),
      end: dayjs(),
    });
  }
}
