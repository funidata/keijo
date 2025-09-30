import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDimensionOptions } from "../common/useDimensionOptions";
import { axiosJira } from "./axiosInstance";
import { JiraIssue, JiraIssueResult } from "./jira-types";
import { escapeUserInputForJql } from "./jira-utils";

/**
 * User's recent issues.
 */
export const useRecentJiraIssues = (): JiraIssue[] => {
  const dimensionOptions = useDimensionOptions();
  const nvIssueKeys = dimensionOptions.issue;

  const projects = useMemo(() => {
    // FIXME: This list must be filtered by project keys fetched from Jira to prevent keys that will fail the query.
    // FIXME: In production, there are both malformed ticket keys that cannot be parsed like this and tickets of
    // FIXME: projects that no longer exist.
    return Array.from(new Set(nvIssueKeys.map((key) => key.split("-")[0])));
  }, [nvIssueKeys]);

  const jqlProjectList = projects.map((name) => escapeUserInputForJql(name)).join(",");

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
          AND project IN (${jqlProjectList})
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
