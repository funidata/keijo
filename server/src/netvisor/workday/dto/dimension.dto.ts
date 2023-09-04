import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Dimension {
  @Field()
  name: string;

  @Field()
  value: string;
}
