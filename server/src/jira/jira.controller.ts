import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response, Request } from "express";
import { BypassHeadersGuard } from "../decorators/bypass-headers-guard.decorator";
import { JiraAuthGuard } from "./jira.guard";
import { JiraService } from "./jira.service";
import { SessionTokenGuard } from "./token.guard";
import { ConfigService } from "../config/config.service";
import { JiraTokens } from "./jira.types";
import { SessionUser, ReqUser } from "./user.decorator";
import {
  JiraSearchKeyDto,
  JiraSearchRecentDto,
  JiraSearchTextDto,
} from "./dto/jira-search-jql.dto";

@Controller("jira")
export class JiraController {
  constructor(
    private jiraService: JiraService,
    private configService: ConfigService,
  ) {}

  @BypassHeadersGuard()
  @UseGuards(JiraAuthGuard)
  @Get()
  jiraAuthRedirect() {}

  @BypassHeadersGuard()
  @UseGuards(JiraAuthGuard)
  @Get("callback")
  async handleRedirect(@Res() response: Response, @ReqUser() jiraTokens: JiraTokens) {
    this.jiraService.setJiraSessionTokens(jiraTokens);
    response.redirect(301, this.configService.config.jira.callbackRedirectUrl);
  }

  @BypassHeadersGuard()
  @Get("status")
  jiraStatus(@Req() request: Request) {
    const user = request.session?.user;
    return { authenticated: !!(user?.accessToken && user?.refreshToken) };
  }

  @BypassHeadersGuard()
  @Get("remove-session")
  async removeSession(@Req() request: Request, @Res() response: Response) {
    request.session.destroy(() => {
      response.redirect(this.configService.config.jira.callbackRedirectUrl);
    });
  }

  @BypassHeadersGuard()
  @UseGuards(SessionTokenGuard)
  @Post("/issues/search-text")
  async searchText(@SessionUser() jiraTokens: JiraTokens, @Body() body: JiraSearchTextDto) {
    return this.jiraService.searchIssuesByText(jiraTokens.accessToken, body);
  }

  @BypassHeadersGuard()
  @UseGuards(SessionTokenGuard)
  @Post("/issues/search-key")
  async searchKey(@SessionUser() jiraTokens: JiraTokens, @Body() body: JiraSearchKeyDto) {
    return this.jiraService.searchIssuesByKey(jiraTokens.accessToken, body);
  }

  @BypassHeadersGuard()
  @UseGuards(SessionTokenGuard)
  @Post("/issues/search-recent")
  async searchRecentIssues(
    @SessionUser() jiraTokens: JiraTokens,
    @Body() body: JiraSearchRecentDto,
  ) {
    return this.jiraService.searchRecentIssues(jiraTokens.accessToken, body);
  }
}
