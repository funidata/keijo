import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSettings } from "./user-settings.model";
import { UserSettingsResolver } from "./user-settings.resolver";
import { UserSettingsService } from "./user-settings.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  providers: [UserSettingsService, UserSettingsResolver],
  exports: [TypeOrmModule, UserSettingsService],
})
export class UserSettingsModule {}
