import { useQuery } from "@tanstack/react-query";
import { useIsJiraAuthenticated } from "./jira-api";
import { axiosKeijo } from "./axiosInstance";
import { JiraIssueResult } from "./jira-types";

export const useJiraIssueSummary = (issueKey: string | null) => {
  const { isJiraAuth } = useIsJiraAuthenticated();

  const query = useQuery({
    queryKey: ["jira-issue-summary", issueKey],
    enabled: isJiraAuth && !!issueKey,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const result = await axiosKeijo.post<JiraIssueResult>("/issues/search-key", {
        keys: [issueKey!],
        maxResults: 1,
      });
      return result.data;
    },
  });
  return { summary: query.data?.issues[0]?.fields.summary, isJiraAuth };
};
