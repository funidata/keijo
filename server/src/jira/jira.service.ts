import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { AxiosService } from "../axios/axios.service";
import { ConfigService } from "../config/config.service";
import { JiraTokens } from "./jira.types";

@Injectable({ scope: Scope.REQUEST })
export class JiraService {
  constructor(
    private axiosService: AxiosService,
    private configService: ConfigService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async getFreshTokens(refreshToken: string): Promise<JiraTokens> {
    const { clientId, clientSecret, tokenUrl } = this.configService.config.jira;
    try {
      const res = await this.axiosService.post<{ refresh_token: string; access_token: string }>(
        tokenUrl,
        {
          grant_type: "refresh_token",
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      return { refreshToken: res.data.refresh_token, accessToken: res.data.access_token };
    } catch {
      this.request.session.user = undefined;
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }

  setJiraSessionTokens(jiraTokens: JiraTokens) {
    this.request.session.user = jiraTokens;
  }
}
