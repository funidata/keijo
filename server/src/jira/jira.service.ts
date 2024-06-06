import { Inject, Injectable, Scope } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { AxiosService } from "src/axios/axios.service";
import { ConfigService } from "src/config/config.service";
import { JiraTokens } from "./jira.types";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class JiraService {
  constructor(
    private axiosService: AxiosService,
    private configService: ConfigService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async getFreshTokens(
    refreshToken: string,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const { clientId, clientSecret, tokenUrl } = this.configService.config.jira;
    const res: AxiosResponse<{ refresh_token: string; access_token: string }> =
      await this.axiosService.post(
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
  }

  setJiraSessionTokens(jiraTokens: JiraTokens) {
    this.request.session.user = jiraTokens;
  }
}
