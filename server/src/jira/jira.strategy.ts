import { Strategy, StrategyOptions } from "passport-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { JiraTokens } from "./jira.types";

@Injectable()
export class JiraStrategy extends PassportStrategy(Strategy, "jira") {
  constructor(configService: ConfigService) {
    const { authorizationUrl, callbackUrl, clientId, clientSecret, tokenUrl, scopes } =
      configService.config.jira;
    super(<StrategyOptions>{
      authorizationURL: authorizationUrl,
      callbackURL: callbackUrl,
      clientID: clientId,
      clientSecret: clientSecret,
      tokenURL: tokenUrl,
      state: true,
      scope: scopes,
    });
  }

  authorizationParams() {
    return {
      audience: "api.atlassian.com",
      prompt: "consent",
    };
  }

  async validate(accessToken: string, refreshToken: string): Promise<JiraTokens> {
    return { accessToken, refreshToken };
  }
}
