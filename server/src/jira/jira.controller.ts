import { Controller, Get, Req, Res, Session, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { BypassHeadersGuard } from "src/decorators/bypass-headers-guard.decorator";
import { JiraAuthGuard } from "./jira.guard";
import { JiraService } from "./jira.service";
import { tokenGuard } from "./token.guard";
import { ConfigService } from "src/config/config.service";
import { RequestWithTokens, SessionWithTokens } from "./jira.types";

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
  async handleRedirect(
    @Res({ passthrough: true }) response: Response,
    @Req()
    request: RequestWithTokens,
    @Session() session: SessionWithTokens,
  ) {
    session.user = {
      accessToken: request.user.accessToken,
      refreshToken: request.user.refreshToken,
    };
    response.redirect(301, this.configService.config.jira.callbackRedirectUrl);
  }

  @BypassHeadersGuard()
  @UseGuards(tokenGuard)
  @Get("refresh")
  async refreshTokens(@Session() session: SessionWithTokens) {
    const { accessToken, refreshToken } = await this.jiraService.getFreshTokens(
      session.user.refreshToken,
    );
    session.user = { accessToken: accessToken, refreshToken: refreshToken };
    return { access_token: accessToken };
  }

  @BypassHeadersGuard()
  @UseGuards(tokenGuard)
  @Get("access-token")
  async getAccessToken(@Session() session: SessionWithTokens) {
    return { access_token: session.user.accessToken };
  }
}
