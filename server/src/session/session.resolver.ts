import { Query, Resolver } from "@nestjs/graphql";
import { BypassHeadersGuard } from "../decorators/bypass-headers-guard.decorator";
import { EmployeeNumber } from "../decorators/employee-number.decorator";
import { SessionStatus } from "./dto/session-status.dto";
import { SessionService } from "./session.service";

@Resolver()
export class SessionResolver {
  constructor(private sessionService: SessionService) {}

  @BypassHeadersGuard()
  @Query(() => SessionStatus)
  getSessionStatus(@EmployeeNumber() employeeNumber: number | undefined): SessionStatus {
    return this.sessionService.getSessionStatus(employeeNumber);
  }
}
