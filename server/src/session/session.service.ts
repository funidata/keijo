import { Injectable } from "@nestjs/common";
import { AppLogger } from "../logger/app-logger";
import { SessionStatus } from "./dto/session-status.dto";

@Injectable()
export class SessionService {
  constructor(private logger: AppLogger) {
    logger.setContext(SessionService.name);
  }

  getSessionStatus(employeeNumber: number | undefined): SessionStatus {
    if (employeeNumber === undefined) {
      this.logger.warn("User without employee number detected.");
    }

    return { employeeNumber: employeeNumber === undefined ? null : employeeNumber };
  }
}
