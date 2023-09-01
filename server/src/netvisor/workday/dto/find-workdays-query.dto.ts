import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FindWorkdaysInput {
  @Field()
  start: Date;

  @Field()
  end: Date;
}
