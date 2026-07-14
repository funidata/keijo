import { useQuery } from "@tanstack/react-query";
import { useIsJiraAuthenticated } from "./jira-api";
import { axiosJira } from "./axiosInstance";
import { JiraIssueResult } from "./jira-types";
import { keyIsInKeys } from "./jql";

export const useJiraIssueSummary = (issueKey: string | null) => {
  const { isJiraAuth } = useIsJiraAuthenticated();

  const query = useQuery({
    queryKey: ["jira-issue-summary", issueKey],
    enabled: isJiraAuth && !!issueKey,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const result = await axiosJira.post<JiraIssueResult>("/search/jql", {
        fields: ["summary"],
        maxResults: 1,
        jql: keyIsInKeys([issueKey!]),
      });
      return result.data;
    },
  });
  return { summary: query.data?.issues[0]?.fields.summary, isJiraAuth };
};
