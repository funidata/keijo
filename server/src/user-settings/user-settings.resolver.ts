import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EmployeeNumber } from "../decorators/employee-number.decorator";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { UserSettings } from "./user-settings.model";
import { UserSettingsService } from "./user-settings.service";
import { EntryTemplateInput } from "./dto/entry-template.dto";

@Resolver()
export class UserSettingsResolver {
  constructor(private userSettingsService: UserSettingsService) {}

  @Query(() => UserSettings)
  async getMySettings(@EmployeeNumber() employeeNumber: number) {
    return this.userSettingsService.findOneByEmployeeNumber(employeeNumber);
  }

  @Mutation(() => UserSettings)
  async updateSettings(
    @EmployeeNumber() employeeNumber: number,
    @Args("settings") update: UpdateSettingsDto,
  ) {
    return this.userSettingsService.update(employeeNumber, update);
  }

  @Mutation(() => UserSettings)
  async addEntryTemplate(
    @EmployeeNumber() employeeNumber: number,
    @Args("template") entry: EntryTemplateInput,
  ) {
    return this.userSettingsService.addEntryTemplate(employeeNumber, entry);
  }

  @Mutation(() => UserSettings)
  async removeEntryTemplate(
    @EmployeeNumber() employeeNumber: number,
    @Args("templateKey") entryKey: number,
  ) {
    return this.userSettingsService.removeEntryTemplate(employeeNumber, entryKey);
  }
}
