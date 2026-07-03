import { Test, TestingModule } from "@nestjs/testing";
import { JiraService } from "./jira.service";
import { REQUEST } from "@nestjs/core";
import { ConfigService } from "../config/config.service";
import { AxiosService } from "../axios/axios.service";

describe("JiraService", () => {
  let service: JiraService;
  let axiosService: { get: jest.Mock; post: jest.Mock };

  const expectJiraHeaders = (token = "test-access-token") =>
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JiraService,
        { provide: AxiosService, useValue: { get: jest.fn(), post: jest.fn() } },
        {
          provide: ConfigService,
          useValue: {
            config: {
              jira: {
                cloudId: "test-cloud-id",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                tokenUrl: "https://auth.atlassian.com/oauth/token",
              },
            },
          },
        },
        {
          provide: REQUEST,
          useValue: {
            session: {
              user: {
                accessToken: "test-access-token",
                refreshToken: "test-refresh-token",
              },
            },
          },
        },
      ],
    }).compile();

    service = await module.resolve<JiraService>(JiraService);
    axiosService = module.get(AxiosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("searchIssuesByText", () => {
    it("builds expected JQL payload and returns Jira data", async () => {
      const mockedResponse = {
        data: {
          issues: [{ id: "10001", key: "TEST-1", fields: { summary: "Test issue, do something" } }],
          isLast: true,
          nextPageToken: "",
        },
      };

      axiosService.post.mockResolvedValue(mockedResponse);

      const result = await service.searchIssuesByText("test-access-token", {
        searchTerm: "something",
        maxResults: 100,
      });

      expect(axiosService.post).toHaveBeenCalledWith(
        "https://api.atlassian.com/ex/jira/test-cloud-id/rest/api/3/search/jql",
        expect.objectContaining({
          fields: ["summary"],
          maxResults: 100,
          jql: expect.stringContaining('summary ~ "something*"'),
        }),
        expectJiraHeaders(),
      );

      expect(result).toEqual(mockedResponse.data);
    });
  });

  describe("searchIssuesByKey", () => {
    it("builds expected JQL payload when issue key is provided", async () => {
      const mockedResponse = {
        data: {
          issues: [{ id: "10002", key: "TEST-2", fields: { summary: "Issue 2" } }],
          isLast: true,
          nextPageToken: "",
        },
      };

      axiosService.post.mockResolvedValue(mockedResponse);

      const result = await service.searchIssuesByKey("test-access-token", {
        keys: ["TEST-2", "TEST-3"],
        maxResults: 100,
      });

      expect(axiosService.post).toHaveBeenCalledWith(
        "https://api.atlassian.com/ex/jira/test-cloud-id/rest/api/3/search/jql",
        expect.objectContaining({
          fields: ["summary"],
          maxResults: 100,
          jql: expect.stringContaining("key in ("),
        }),
        expectJiraHeaders(),
      );

      const payload = axiosService.post.mock.calls[0][1];
      expect(payload.jql).toContain("'TEST-2'");
      expect(payload.jql).toContain("'TEST-3'");
      expect(payload.jql).toContain("ORDER BY lastViewed DESC");

      expect(result).toEqual(mockedResponse.data);
    });

    it("returns empty result when keys are empty", async () => {
      const result = await service.searchIssuesByKey("test-access-token", {
        keys: [],
        maxResults: 100,
      });

      expect(axiosService.post).not.toHaveBeenCalled();
      expect(result).toEqual({ issues: [], isLast: true, nextPageToken: "" });
    });
  });

  describe("searchRecentIssues", () => {
    it("returns empty result when allowed projects are empty", async () => {
      axiosService.get.mockResolvedValue({
        data: {
          values: [{ key: "OTHER" }],
        },
      });

      const result = await service.searchRecentIssues("test-access-token", {
        nvIssueKeys: ["TEST-1", "TEST-2"],
        projectsPreset: [],
        maxResults: 30,
      });

      expect(axiosService.get).toHaveBeenCalled();
      expect(axiosService.post).not.toHaveBeenCalled();
      expect(result).toEqual({ issues: [], isLast: true, nextPageToken: "" });
    });

    it("builds expected JQL payload when allowed projects exist", async () => {
      axiosService.get.mockResolvedValue({
        data: {
          values: [{ key: "TEST" }, { key: "ABC" }],
        },
      });

      const mockedResponse = {
        data: {
          issues: [{ id: "10003", key: "TEST-10", fields: { summary: "Recent issue" } }],
          isLast: true,
          nextPageToken: "",
        },
      };
      axiosService.post.mockResolvedValue(mockedResponse);

      const result = await service.searchRecentIssues("test-access-token", {
        nvIssueKeys: ["TEST-1", "TEST-2", "OTHER-1"],
        projectsPreset: ["TEST"],
        maxResults: 30,
      });

      expect(axiosService.post).toHaveBeenCalledWith(
        "https://api.atlassian.com/ex/jira/test-cloud-id/rest/api/3/search/jql",
        expect.objectContaining({
          fields: ["summary"],
          maxResults: 30,
          jql: expect.stringContaining("issueHistory()"),
        }),
        expectJiraHeaders(),
      );

      const payload = axiosService.post.mock.calls[0][1];
      expect(payload.jql).toContain('project IN ("TEST")');
      expect(payload.jql).toContain("ORDER BY lastViewed DESC");
      expect(result).toEqual(mockedResponse.data);
    });
  });

  describe("callJiraWithRefresh", () => {
    it("refreshes token and retries once when first Jira call returns 401", async () => {
      const first401 = { response: { status: 401 } };
      const refreshTokenApiResponse = {
        data: {
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
        },
      };
      const retriedJiraSearchResponse = {
        data: {
          issues: [{ id: "90001", key: "TEST-99", fields: { summary: "Retried issue" } }],
          isLast: true,
          nextPageToken: "",
        },
      };
      const refreshRequestPayload = expect.objectContaining({
        grant_type: "refresh_token",
        refresh_token: "test-refresh-token",
      });

      // 1) Jira search -> 401
      // 2) token refresh -> success
      // 3) Jira search retry -> success
      axiosService.post
        .mockRejectedValueOnce(first401)
        .mockResolvedValueOnce(refreshTokenApiResponse)
        .mockResolvedValueOnce(retriedJiraSearchResponse);

      const result = await service.searchIssuesByText("test-access-token", {
        searchTerm: "retry",
        maxResults: 100,
      });

      expect(axiosService.post).toHaveBeenCalledTimes(3);

      // refresh call happened to Atlassian token endpoint
      expect(axiosService.post).toHaveBeenNthCalledWith(
        2,
        "https://auth.atlassian.com/oauth/token",
        refreshRequestPayload,
        expect.any(Object),
      );

      // retried Jira call used refreshed token
      expect(axiosService.post).toHaveBeenNthCalledWith(
        3,
        "https://api.atlassian.com/ex/jira/test-cloud-id/rest/api/3/search/jql",
        expect.any(Object),
        expectJiraHeaders("new-access-token"),
      );

      expect(result).toEqual(retriedJiraSearchResponse.data);
    });
  });
});
