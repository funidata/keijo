import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RecordType {
  @Field()
  name: string;

  @Field()
  ratioNumber: number;
}
