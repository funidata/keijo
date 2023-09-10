import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddWorkdayEntryInput {
  @Field()
  duration: number;

  @Field()
  entryType: string;
}
