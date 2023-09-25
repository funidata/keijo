import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RemoveWorkdayEntryInput {
  @Field()
  date: Date;

  @Field()
  key: string;
}
