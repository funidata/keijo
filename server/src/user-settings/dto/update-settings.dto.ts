import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateSettingsDto {
  @Field({ nullable: true })
  productPreset?: string;

  @Field({ nullable: true })
  activityPreset?: string;

  @Field({ nullable: true })
  showWeekend?: boolean;

  @Field({ nullable: true })
  setRemainingHours?: boolean;
}
