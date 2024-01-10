import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DimensionOptions {
  @Field(() => [String])
  product: string[];

  @Field(() => [String])
  activity: string[];

  @Field(() => [String])
  issue: string[];

  @Field(() => [String])
  client: string[];
}
