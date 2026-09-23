import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsNumber, IsString } from "class-validator";
import { IsDimensionValue } from "../../dimension/is-dimension-value.decorator";

@InputType()
export class AddWorkdayEntryInput {
  @Field()
  @IsDate()
  date: Date;

  @Field()
  @IsNumber()
  duration: number;

  @Field()
  @IsString()
  description: string;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  product: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  activity: string | null;

  @IsDimensionValue({
    message: "Selected issue is no longer available.",
  })
  @Field(() => String, { nullable: true })
  issue: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  client: string | null;
}
