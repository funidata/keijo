import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FindWorkdaysQuery {
  @Field()
  start: Date;

  @Field()
  end: Date;
}
