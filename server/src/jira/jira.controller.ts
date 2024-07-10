import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { BypassHeadersGuard } from "../decorators/bypass-headers-guard.decorator";
import { JiraAuthGuard } from "./jira.guard";
import { JiraService } from "./jira.service";
import { SessionTokenGuard } from "./token.guard";
import { ConfigService } from "../config/config.service";
import { JiraTokens } from "./jira.types";
import { SessionUser, ReqUser } from "./user.decorator";

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
  @UseGuards(SessionTokenGuard)
  @Get("refresh")
  async refreshTokens(@SessionUser() jiraTokens: JiraTokens) {
    const freshTokens = await this.jiraService.getFreshTokens(jiraTokens.refreshToken);
    this.jiraService.setJiraSessionTokens(freshTokens);
    return { access_token: freshTokens.accessToken };
  }

  @BypassHeadersGuard()
  @UseGuards(SessionTokenGuard)
  @Get("access-token")
  async getAccessToken(@SessionUser() jiraTokens: JiraTokens) {
    const cloudId = this.configService.config.jira.cloudId;
    return { access_token: jiraTokens.accessToken, cloud_id: cloudId };
  }
}
