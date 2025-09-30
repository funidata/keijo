import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDimensionOptions } from "../common/useDimensionOptions";
import { axiosJira } from "./axiosInstance";
import { JiraIssue, JiraIssueResult, JiraProjectResult } from "./jira-types";
import { escapeUserInputForJql } from "./jira-utils";

// Cache query data for 5 minutes.
const staleTime = 5 * 60 * 1000;

/**
 * User's recent issues.
 */
export const useRecentJiraIssues = (): JiraIssue[] => {
  const dimensionOptions = useDimensionOptions();
  const nvIssueKeys = dimensionOptions.issue;

  const projectQuery = useQuery({
    queryKey: ["all-projects"],
    staleTime,
    queryFn: async () => {
      const result = await axiosJira.get<JiraProjectResult>("/project/search", {
        params: {
          maxResults: 100,
          status: "live",
        },
      });

      return result.data;
    },
  });

  const jiraProjects = projectQuery.data?.values || [];

  const allowedProjects = useMemo(() => {
    // This list can include pretty much anything if there are malformed tickets entered into
    // Netvisor by accident, etc.
    const nvProjects = Array.from(new Set(nvIssueKeys.map((key) => key.split("-")[0])));

    // Sanitize the list by filtering with actual Jira project keys.
    const jiraProjectKeys = jiraProjects.map((project) => project.key);
    return nvProjects.filter((key) => jiraProjectKeys.includes(key));
  }, [nvIssueKeys, jiraProjects]);

  const jqlProjectList = allowedProjects.map(escapeUserInputForJql).join(",");

  const issueQuery = useQuery({
    queryKey: ["recentIssues"],
    enabled: allowedProjects.length > 0,
    staleTime,
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
  return (
    issueQuery.data?.issues.filter((issue) => nvIssueKeys.includes(issue.key)).slice(0, 20) || []
  );
};
