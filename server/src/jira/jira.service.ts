import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { AxiosService } from "../axios/axios.service";
import type { AxiosError } from "axios";
import { ConfigService } from "../config/config.service";
import { JiraTokens } from "./jira.types";
import {
  JiraSearchJqlDto,
  JiraSearchTextDto,
  JiraSearchKeyDto,
  JiraSearchRecentDto,
} from "./dto/jira-search-jql.dto";
import { escapeUserInputForJql, keyIsInKeys } from "./jira-utils";

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

  async searchJql(accessToken: string, body: JiraSearchJqlDto) {
    const cloudId = this.configService.config.jira.cloudId;
    const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search/jql`;

    return this.callJiraWithRefresh(accessToken, async (token) => {
      const result = await this.axiosService.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return result.data;
    });
  }

  async searchIssuesByText(accessToken: string, body: JiraSearchTextDto) {
    const payload: JiraSearchJqlDto = {
      fields: ["summary"],
      maxResults: body.maxResults ?? 100,
      jql: `summary ~ ${escapeUserInputForJql(body.searchTerm.concat("*"))} ORDER BY lastViewed DESC`,
    };
    return this.searchJql(accessToken, payload);
  }

  async searchIssuesByKey(accessToken: string, body: JiraSearchKeyDto) {
    if (!body.keys?.length) {
      return { issues: [], isLast: true, nextPageToken: "" };
    }

    const payload: JiraSearchJqlDto = {
      fields: ["summary"],
      maxResults: body.maxResults ?? 100,
      jql: `${keyIsInKeys(body.keys)} ORDER BY lastViewed DESC`,
    };
    return this.searchJql(accessToken, payload);
  }

  async searchRecentIssues(accessToken: string, body: JiraSearchRecentDto) {
    // This list can include pretty much anything if there are malformed tickets entered into
    // Netvisor by accident, etc.
    const nvProjects = Array.from(new Set(body.nvIssueKeys.map((key) => key.split("-")[0])));

    // Sanitize the list by filtering with actual Jira project keys.
    const jiraProjectKeys = await this.listJiraProjectKeys(accessToken);
    let allowedProjects = nvProjects.filter((key) => jiraProjectKeys.includes(key));

    if (body.projectsPreset?.length) {
      allowedProjects = allowedProjects.filter((key) => body.projectsPreset?.includes(key));
    }

    if (!allowedProjects.length) {
      return { issues: [], isLast: true, nextPageToken: "" };
    }

    const jqlProjectList = allowedProjects.map(escapeUserInputForJql).join(",");

    const payload: JiraSearchJqlDto = {
      fields: ["summary"],
      maxResults: body.maxResults ?? 30,
      jql: [
        "(issuekey IN issueHistory() OR assignee = currentUser() OR reporter = currentUser())",
        "AND project IN (" + jqlProjectList + ")",
        "ORDER BY lastViewed DESC",
      ].join(" "),
    };
    return this.searchJql(accessToken, payload);
  }

  private async listJiraProjectKeys(accessToken: string): Promise<string[]> {
    const cloudId = this.configService.config.jira.cloudId;
    const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search`;

    const data = await this.callJiraWithRefresh(accessToken, async (token) => {
      const result = await this.axiosService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          maxResults: 100,
          // Only active Jira projects.
          status: "live",
        },
      });
      return result.data;
    });

    return (data.values || []).map((project) => project.key);
  }

  // Refresh and retry the request if access token is expired.
  private async callJiraWithRefresh<T>(
    accessToken: string,
    operation: (token: string) => Promise<T>,
  ): Promise<T> {
    try {
      return await operation(accessToken);
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;

      if ((status === 401 || status === 403) && this.request.session.user?.refreshToken) {
        const freshTokens = await this.getFreshTokens(this.request.session.user.refreshToken);
        this.setJiraSessionTokens(freshTokens);

        try {
          return await operation(freshTokens.accessToken);
        } catch (retryError) {
          this.throwMappedJiraError(retryError);
        }
      }

      this.throwMappedJiraError(error);
    }
  }

  private throwMappedJiraError(error: unknown): never {
    const status = (error as AxiosError)?.response?.status;
    if (status === 401 || status === 403) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    if (status && status >= 400 && status < 600) {
      throw new HttpException("Jira request failed", status);
    }
    throw new HttpException("Jira request failed", HttpStatus.BAD_GATEWAY);
  }
}
