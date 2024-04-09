import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RecordType {
  @Field()
  name: string;

  @Field({ nullable: true })
  ratioNumber: number | null;

  @Field()
  unitIsHour: boolean;
}
