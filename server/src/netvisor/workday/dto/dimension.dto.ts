import { Field, ObjectType } from "@nestjs/graphql";

/**
 * Certain dimension (specified by name) with attached value.
 *
 * Not to be confused with `Dimension` that models a dimension with an enumeration of its possible
 * values.
 */
@ObjectType()
export class DimensionRecord {
  @Field()
  name: string;

  @Field()
  value: string;
}
