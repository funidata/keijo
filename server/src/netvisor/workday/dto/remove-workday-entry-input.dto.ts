import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsNumberString } from "class-validator";

@InputType()
export class RemoveWorkdayEntryInput {
  @Field()
  @IsDate()
  date: Date;

  @Field()
  @IsNumberString()
  key: string;
}
