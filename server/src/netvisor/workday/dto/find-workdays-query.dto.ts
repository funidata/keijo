import { Field, InputType } from "@nestjs/graphql";
import { IsDate } from "class-validator";

@InputType()
export class FindWorkdaysInput {
  @Field()
  @IsDate()
  start: Date;

  @Field()
  @IsDate()
  end: Date;
}
