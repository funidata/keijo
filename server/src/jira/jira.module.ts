import { Module } from "@nestjs/common";
import { JiraController } from "./jira.controller";
import { JiraStrategy } from "./jira.strategy";
import { AxiosModule } from "../axios/axios.module";
import { JiraService } from "./jira.service";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [AxiosModule, PassportModule.register({ session: true })],
  controllers: [JiraController],
  providers: [JiraStrategy, JiraService],
})
export class JiraModule {}
