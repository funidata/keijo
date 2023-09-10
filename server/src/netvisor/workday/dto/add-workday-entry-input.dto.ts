import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddWorkdayEntryInput {
  @Field()
  date: Date;

  @Field()
  duration: number;

  @Field()
  recordTypeRatioNumber: number;
}
