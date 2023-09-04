import { Field, ObjectType } from "@nestjs/graphql";
import { Dimension } from "./dimension.dto";

@ObjectType()
export class Entry {
  @Field()
  duration: number;

  @Field()
  entryType: string;

  @Field(() => [Dimension])
  dimensions: Dimension[];
}
