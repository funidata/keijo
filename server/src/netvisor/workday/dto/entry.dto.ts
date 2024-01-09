import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { DimensionRecord } from "./dimension-record.dto";

@ObjectType()
export class Entry {
  @Field()
  key: string;

  @Field()
  duration: number;

  @Field()
  entryType: string;

  @Field(() => String, { nullable: true })
  product: string | null;

  @Field(() => String, { nullable: true })
  activity: string | null;

  @Field(() => String, { nullable: true })
  issue: string | null;

  @Field(() => String, { nullable: true })
  client: string | null;

  // FIXME: Remove
  @Field(() => [DimensionRecord])
  dimensions: DimensionRecord[];
}

export class EntryDimensions extends PickType(Entry, ["product", "activity", "issue", "client"]) {}
