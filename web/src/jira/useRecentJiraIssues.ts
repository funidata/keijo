import { useQuery } from "@tanstack/react-query";
import { axiosJira } from "./axiosInstance";
import { JiraIssue, JiraIssueResult } from "./jiraApi";

/**
 * User's recent issues.
 */
export const useRecentJiraIssues = (): JiraIssue[] => {
  const res = useQuery({
    queryKey: ["recentIssues"],
    queryFn: async () => {
      const payload = {
        fields: ["summary"],
        maxResults: 10,
        jql: "issuekey in issueHistory() OR assignee = currentUser() OR reporter = currentUser() ORDER BY lastViewed DESC",
      };

      const result = await axiosJira.post<JiraIssueResult>("/search/jql", payload);
      return result.data;
    },
  });

  return res.data?.issues || [];
};
