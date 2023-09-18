import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Status {
  @Field(() => Number, { nullable: true })
  employeeNumber: number | null;
}
