import { Field, InputType } from "@nestjs/graphql";
import { DimensionRecord } from "./dimension-record.dto";

@InputType()
export class AddWorkdayEntryInput {
  @Field()
  date: Date;

  @Field()
  duration: number;

  @Field()
  recordTypeRatioNumber: number;

  @Field(() => [DimensionRecord])
  dimensions: DimensionRecord[];
}
