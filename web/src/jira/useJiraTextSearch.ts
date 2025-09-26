import { useQuery } from "@tanstack/react-query";
import { useDimensionOptions } from "../common/useDimensionOptions";
import { axiosJira } from "./axiosInstance";
import { JiraIssue, JiraIssueResult } from "./jira-types";
import { escapeUserInputForJql } from "./jira-utils";

/**
 * Search for issues by text. Targets issue summary (title) only.
 */
export const useJiraTextSearch = (searchTerm: string): JiraIssue[] => {
  const dimensionOptions = useDimensionOptions();
  const nvIssueKeys = dimensionOptions.issue;

  const res = useQuery({
    queryKey: ["jira-text-search", searchTerm],
    // Don't fire on empty search terms.
    enabled: !!searchTerm,
    // Cache briefly to prevent duplicate queries when user erases some text, etc.
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      const payload = {
        fields: ["summary"],
        // Pagination support required if this is raised too much.
        maxResults: 100,
        jql: `summary ~ ${escapeUserInputForJql(searchTerm)} ORDER BY lastViewed DESC`,
      };

      const result = await axiosJira.post<JiraIssueResult>("/search/jql", payload);
      return result.data;
    },
  });

  // Filter in only allowed issues and cap length.
  return res.data?.issues.filter((issue) => nvIssueKeys.includes(issue.key)).slice(0, 100) || [];
};
