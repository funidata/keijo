import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { UserSettings } from "./user-settings.model";

@Injectable()
export class UserSettingsService {
  constructor(@InjectRepository(UserSettings) private userSettings: Repository<UserSettings>) {}

  /**
   * Find user's settings safely.
   *
   * User settings database entry is created if one is not found for the given
   * employee number. This is done dynamically because Keijo does not get a
   * user list or notifications about new users.
   */
  async findOneByEmployeeNumber(employeeNumber: number): Promise<UserSettings> {
    const existing = await this.userSettings.findOneBy({ employeeNumber });

    if (!existing) {
      await this.create(employeeNumber);
      return this.findOneByEmployeeNumber(employeeNumber);
    }

    return existing;
  }

  async update(employeeNumber: number, settingsUpdate: UpdateSettingsDto): Promise<UserSettings> {
    await this.userSettings.update({ employeeNumber }, settingsUpdate);

    return this.findOneByEmployeeNumber(employeeNumber);
  }

  /**
   * Create user settings database entry for user.
   *
   * This method is private because user settings should be created only by this service internally.
   */
  private async create(employeeNumber: number): Promise<void> {
    await this.userSettings.save({ employeeNumber });
  }
}
