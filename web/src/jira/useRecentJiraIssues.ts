import { useQuery as useApolloQuery } from "@apollo/client/react";
import { useQuery } from "@tanstack/react-query";
import { useDimensionOptions } from "../common/useDimensionOptions";
import { GetMySettingsDocument } from "../graphql/generated/graphql";
import { axiosKeijo } from "./axiosInstance";
import { JiraIssue, JiraIssueResult } from "./jira-types";

// Cache query data for 5 minutes.
const staleTime = 5 * 60 * 1000;

/**
 * User's recent issues.
 */
export const useRecentJiraIssues = (): JiraIssue[] => {
  const dimensionOptions = useDimensionOptions();
  const nvIssueKeys = dimensionOptions.issue;

  const { data: settingsData } = useApolloQuery(GetMySettingsDocument);
  const projectsPreset = settingsData?.getMySettings.projectsPreset;

  const normalizedNvIssueKeys = Array.from(new Set(nvIssueKeys)).sort();
  const normalizedProjectsPreset = Array.from(new Set(projectsPreset ?? [])).sort();

  const issueQuery = useQuery({
    queryKey: ["recentIssues", normalizedProjectsPreset, normalizedNvIssueKeys],
    enabled: normalizedNvIssueKeys.length > 0,
    staleTime,
    queryFn: async () => {
      const result = await axiosKeijo.post<JiraIssueResult>("/issues/search-recent", {
        nvIssueKeys: normalizedNvIssueKeys,
        projectsPreset: normalizedProjectsPreset,
        // Fetch a little bit more than we're going to use as the result may include issues that
        // are not in Netvisor.
        maxResults: 30,
      });
      return result.data;
    },
  });

  // Filter in only allowed issues and cap length.
  return (
    issueQuery.data?.issues
      .filter((issue) => normalizedNvIssueKeys.includes(issue.key))
      .slice(0, 20) || []
  );
};
