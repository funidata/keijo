import { Injectable } from "@nestjs/common";
import { Logger } from "../logger/logger";
import { SessionStatus } from "./dto/session-status.dto";

@Injectable()
export class SessionService {
  constructor(private logger: Logger) {
    logger.setContext(SessionService.name);
  }

  getSessionStatus(employeeNumber: number | undefined): SessionStatus {
    if (employeeNumber === undefined) {
      this.logger.warn("User without employee number detected.");
    }

    return { employeeNumber: employeeNumber === undefined ? null : employeeNumber };
  }
}
