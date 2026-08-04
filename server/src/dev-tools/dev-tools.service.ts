import { Injectable, Logger } from "@nestjs/common";
import { UserSettingsService } from "../user-settings/user-settings.service";

@Injectable()
export class DevToolsService {
  private readonly logger = new Logger(DevToolsService.name);

  constructor(private userSettingsService: UserSettingsService) {}

  /**
   * Reset data by employee ID.
   */
  async reset(employeeId: number) {
    this.logger.warn(`Resetting data (employeeNumber=${employeeId}).`);
    return this.userSettingsService.deleteByEmployeeNumber(employeeId);
  }
}
