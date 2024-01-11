import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddWorkdayEntryInput {
  @Field()
  date: Date;

  @Field()
  duration: number;

  @Field(() => String, { nullable: true })
  product: string | null;

  @Field(() => String, { nullable: true })
  activity: string | null;

  @Field(() => String, { nullable: true })
  issue: string | null;

  @Field(() => String, { nullable: true })
  client: string | null;
}
