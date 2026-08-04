import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsJiraAuthenticated } from "./jira-api";
import { axiosKeijo } from "./axiosInstance";
import { JiraIssue, JiraIssueResult } from "./jira-types";

const findCachedIssue = (
  issueKey: string,
  queryClient: ReturnType<typeof useQueryClient>,
): JiraIssue | undefined => {
  const queryPrefixes = [
    ["jira-text-search"],
    ["jira-issue-key-search"],
    ["recentIssues"],
  ] as const;

  for (const queryPrefix of queryPrefixes) {
    const matchingQueries = queryClient.getQueriesData<JiraIssueResult>({ queryKey: queryPrefix });

    for (const [, data] of matchingQueries) {
      const cachedIssue = data?.issues.find((issue) => issue.key === issueKey);
      if (cachedIssue) {
        return cachedIssue;
      }
    }
  }
  return undefined;
};

export const useJiraIssueSummary = (issueKey: string | null) => {
  const { isJiraAuth } = useIsJiraAuthenticated();
  const queryClient = useQueryClient();

  const cachedIssue = issueKey ? findCachedIssue(issueKey, queryClient) : undefined;

  const query = useQuery({
    queryKey: ["jira-issue-summary", issueKey],
    enabled: isJiraAuth && !!issueKey && !cachedIssue,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const result = await axiosKeijo.post<JiraIssueResult>("/issues/search-key", {
        keys: [issueKey!],
        maxResults: 1,
      });
      return result.data;
    },
  });
  return {
    summary: cachedIssue?.fields.summary || query.data?.issues[0]?.fields.summary,
    isJiraAuth,
  };
};
