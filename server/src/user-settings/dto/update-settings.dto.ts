import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateSettingsDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  productPreset?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  activityPreset?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  jiraNotificationIgnore?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projectsPreset?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  showWeekend?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  setRemainingHours?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  showJiraIssueStatus?: boolean;
}
