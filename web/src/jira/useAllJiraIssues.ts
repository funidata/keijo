import { useQuery as useApolloQuery } from "@apollo/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { FindDimensionOptionsDocument } from "../graphql/generated/graphql";
import { axiosJira } from "./axiosInstance";
import { JiraIssue, JiraIssueResult } from "./jiraApi";
import { keyIsInKeys } from "./jql";

/**
 * All Jira issues which appear in Netvisor.
 *
 * This hook fetches data for all issues with sequential queries until Jira API offers no further
 * results. The hook output is safe to use while loading. Results are ordered by last viewed time
 * descending.
 */
export const useAllJiraIssues = (): JiraIssue[] => {
  const { data: dimensionData } = useApolloQuery(FindDimensionOptionsDocument);
  const nvIssueKeys = dimensionData?.findDimensionOptions.issue || [];

  const query = useInfiniteQuery<JiraIssueResult>({
    queryKey: ["allIssues"],
    enabled: nvIssueKeys.length > 0,
    // Cache issues for 15 minutes as we are fetching way too much stuff.
    staleTime: 15 * 60 * 1000,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.isLast || !lastPage.nextPageToken) {
        return undefined;
      }
      return lastPage.nextPageToken;
    },
    queryFn: async ({ pageParam }) => {
      const payload = {
        fields: ["summary"],
        // Jira API max value for this endpoint is 5000.
        maxResults: 5000,
        jql: `${keyIsInKeys(nvIssueKeys)} ORDER BY lastViewed DESC`,
        nextPageToken: pageParam,
      };

      const result = await axiosJira.post<JiraIssueResult>("/search/jql", payload);
      return result.data;
    },
  });

  // Drive fetching paginated results with an effect.
  useEffect(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [
    query.hasNextPage,
    query.isFetchingNextPage,
    query.isLoading,
    query.isError,
    query.fetchNextPage,
  ]);

  // Memoize hook output for smooth dropdown operation while loading.
  const allIssues = useMemo(() => {
    return query.data?.pages.flatMap((p) => p.issues) ?? [];
  }, [query.data?.pages]);

  return allIssues;
};
