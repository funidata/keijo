import { Field, ObjectType } from "@nestjs/graphql";
import { DimensionRecord } from "./dimension-record.dto";

@ObjectType()
export class Entry {
  @Field()
  key: string;

  @Field()
  duration: number;

  @Field()
  entryType: string;

  @Field(() => [DimensionRecord])
  dimensions: DimensionRecord[];
}
