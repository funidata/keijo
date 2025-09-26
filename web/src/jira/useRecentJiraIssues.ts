import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDimensionOptions } from "../common/useDimensionOptions";
import { axiosJira } from "./axiosInstance";
import { JiraIssue, JiraIssueResult } from "./jira-types";

/**
 * User's recent issues.
 */
export const useRecentJiraIssues = (): JiraIssue[] => {
  const dimensionOptions = useDimensionOptions();
  const nvIssueKeys = dimensionOptions.issue;

  const projects = useMemo(() => {
    return Array.from(new Set(nvIssueKeys.map((key) => key.split("-")[0])));
  }, [nvIssueKeys]);

  const res = useQuery({
    queryKey: ["recentIssues"],
    enabled: projects.length > 0,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const payload = {
        fields: ["summary"],
        // Fetch a little bit more than we're going to use as the result may include issues that
        // are not in Netvisor.
        maxResults: 30,
        jql: `
          (issuekey IN issueHistory() OR assignee = currentUser() OR reporter = currentUser())
          AND project IN (${projects.join(",")})
          ORDER BY lastViewed DESC
          `,
      };

      const result = await axiosJira.post<JiraIssueResult>("/search/jql", payload);
      return result.data;
    },
  });

  // Filter in only allowed issues and cap length.
  return res.data?.issues.filter((issue) => nvIssueKeys.includes(issue.key)).slice(0, 20) || [];
};
