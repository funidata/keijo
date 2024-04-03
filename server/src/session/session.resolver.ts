import { Query, Resolver } from "@nestjs/graphql";
import { BypassHeadersGuard } from "../decorators/bypass-headers-guard.decorator";
import { EmployeeNumber } from "../decorators/employee-number.decorator";
import { SessionStatus } from "./dto/session-status.dto";
import { SessionService } from "./session.service";

@Resolver()
export class SessionResolver {
  constructor(private sessionService: SessionService) {}

  // FIXME: Rename; this checks for employee number, not session status per se.
  // TODO: Also check for EPPN here?
  @BypassHeadersGuard()
  @Query(() => SessionStatus)
  getSessionStatus(@EmployeeNumber() employeeNumber: number | undefined): SessionStatus {
    return this.sessionService.getSessionStatus(employeeNumber);
  }
}
