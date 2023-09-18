import { Query, Resolver } from "@nestjs/graphql";
import { EmployeeNumber } from "../decorators/employee-number.decorator";
import { Status } from "./dto/status.dto";
import { StatusService } from "./status.service";

@Resolver()
export class StatusResolver {
  constructor(private statusService: StatusService) {}

  @Query(() => Status)
  getStatus(@EmployeeNumber() employeeNumber: number | undefined): Status {
    return this.statusService.getStatus(employeeNumber);
  }
}
