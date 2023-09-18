import { Injectable } from "@nestjs/common";
import { Logger } from "../logger/logger";
import { Status } from "./dto/status.dto";

@Injectable()
export class StatusService {
  constructor(private logger: Logger) {
    logger.setContext(StatusService.name);
  }

  getStatus(employeeNumber: number | undefined): Status {
    if (employeeNumber === undefined) {
      this.logger.warn("User without employee number detected.");
    }

    return { employeeNumber: employeeNumber === undefined ? null : employeeNumber };
  }
}
