import { Field, InputType } from "@nestjs/graphql";
import { IsDate } from "class-validator";

@InputType()
export class AddWorkdayEntryInput {
  @Field()
  @IsDate()
  date: Date;

  @Field()
  duration: number;

  @Field()
  description: string;

  @Field(() => String, { nullable: true })
  product: string | null;

  @Field(() => String, { nullable: true })
  activity: string | null;

  @Field(() => String, { nullable: true })
  issue: string | null;

  @Field(() => String, { nullable: true })
  client: string | null;
}
