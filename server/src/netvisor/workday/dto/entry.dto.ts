import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Entry {
  @Field()
  duration: number;

  @Field()
  entryType: string;
}
