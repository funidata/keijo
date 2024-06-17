import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSettings } from "./user-settings.model";

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  exports: [TypeOrmModule],
})
export class UserSettingsModule {}
