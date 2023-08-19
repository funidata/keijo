import { Query, Resolver } from "@nestjs/graphql";
import { Workday } from "./models/workday.model";

@Resolver()
export class NetvisorResolver {
  @Query(() => Workday)
  test() {
    return null;
  }
}
