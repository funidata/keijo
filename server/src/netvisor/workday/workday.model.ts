import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Workday {
  @Field()
  asd: string;
}
