import { useQuery } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { useMemo } from "react";
import { useDimensionOptions } from "../common/useDimensionOptions";
import { axiosJira } from "./axiosInstance";
import { JiraIssue, JiraIssueResult } from "./jira-types";
import { keyIsInKeys } from "./jql";

/**
 * Search Jira issues by key.
 *
 * Jira API does not support text search on issue keys by partial strings, rather it requires
 * the exact issue key to be used. We implement this functionality by first searching over
 * the issue keys fetched from Netvisor. Matching keys are then used to query Jira API for issues.
 *
 * This approach approximates a conventional text search. As an added bonus, we only ever fetch
 * data for issues that are in Netvisor. However, the current implementation searches only from
 * beginning of a string thus not supporting searching with just the number part of an issue key,
 * for example.
 */
export const useJiraIssueKeySearch = (searchTerm: string): JiraIssue[] => {
  const dimensionOptions = useDimensionOptions();
  const nvIssueKeys = dimensionOptions.issue;

  const nvMatches = useMemo(() => {
    const matches = nvIssueKeys.filter((key) => key.startsWith(searchTerm.toUpperCase()));

    const sorted = sortBy(matches, [
      (value) => {
        return value.split("-")[0];
      },
      (value) => {
        // This little maneuver sorts the number part of issue a number, i.e., [1, 2, 10], not [1, 10, 2].
        return Number(value.split("-")[1]);
      },
    ]);

    // Caution! This list must never be too long. Jira API limits the number of terms in
    // `key IN ()` statements to 1000. If the limit is passed, the API may return issues that
    // we're not queried for causing surprising results.
    return sorted.slice(0, 100);
  }, [nvIssueKeys, searchTerm]);

  const res = useQuery({
    queryKey: ["jira-issue-key-search", nvMatches],
    // Don't fire when there are no matching issues to begin with.
    enabled: nvMatches.length > 0,
    // Cache briefly to prevent duplicate queries when user erases some text, etc.
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      const payload = {
        fields: ["summary"],
        // Pagination support required if this is raised too much.
        maxResults: 100,
        jql: `${keyIsInKeys(nvMatches)} ORDER BY lastViewed DESC`,
      };

      const result = await axiosJira.post<JiraIssueResult>("/search/jql", payload);
      return result.data;
    },
  });

  return res.data?.issues || [];
};
