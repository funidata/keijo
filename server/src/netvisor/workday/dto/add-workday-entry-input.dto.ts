import { Field, InputType } from "@nestjs/graphql";
import { IsDate } from "class-validator";
import { IsDimensionValue } from "../../dimension/is-dimension-value.decorator";

@InputType()
export class AddWorkdayEntryInput {
  @Field()
  @IsDate()
  date: Date;

  @Field()
  duration: number;

  @Field()
  description: string;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  product: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  activity: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  issue: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  client: string | null;
}
