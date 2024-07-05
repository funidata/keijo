import {
  UseQueryResult,
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey,
} from "@tanstack/react-query";
import { axiosJira, axiosKeijo } from "./axiosInstance";
import { jiraQueryMaxResults } from "./jiraConfig";

export type JiraIssueResult = {
  issues: Array<{ key: string; fields: { summary: string } }>;
  total: number;
};

type UseGetIssuesProps = {
  issueKeys: Array<string>;
  enabled?: boolean;
} & Partial<
  UseInfiniteQueryOptions<
    JiraIssueResult,
    Error,
    InfiniteData<JiraIssueResult, number>,
    JiraIssueResult,
    QueryKey,
    number
  >
>;

type UseSearchIssuesProps = {
  issueKeys: Array<string>;
  searchFilter: string;
} & Partial<
  UseInfiniteQueryOptions<
    JiraIssueResult,
    Error,
    InfiniteData<JiraIssueResult, number>,
    JiraIssueResult,
    QueryKey,
    number
  >
>;

const getAccessToken = async () => {
  const token = (await axiosKeijo.get("/access-token")).data;
  axiosJira.defaults.headers.common.Authorization = "Bearer " + token.access_token;
  return token;
};

const useGetAccessToken = (): UseQueryResult<{ access_token: string }> => {
  return useQuery({
    queryKey: ["accessToken"],
    queryFn: getAccessToken,
    retry: false,
  });
};

const getIssues = async (
  jql: string,
  startAt: number = 0,
  numOfIssues: number = jiraQueryMaxResults,
) => {
  return (
    await axiosJira.post<JiraIssueResult>("/search", {
      fields: ["summary"],
      maxResults: numOfIssues,
      startAt: startAt,
      validateQuery: "warn",
      jql: jql,
    })
  ).data;
};

export const useIsJiraAuthenticated = () => {
  const { data, error, isLoading } = useGetAccessToken();
  return { isJiraAuth: !isLoading && data && !error, data, error };
};

/**
 *  Get paginated issue data (e.g, summary) by providing a list of issuekeys.
 *  Queries JiraQueryMaxResults amount of issues per page.
 */
export const useGetIssues = ({ issueKeys, enabled, ...queryProps }: UseGetIssuesProps) => {
  const query = useInfiniteQuery({
    queryKey: ["issues", ...issueKeys],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      return await getIssues(
        `key in (${issueKeys
          .slice(pageParam, pageParam + jiraQueryMaxResults)
          .map((key) => `'${key}'`)
          .join(", ")})`,
        0,
      );
    },
    initialPageParam: 0,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      const nextPageStartIndex = lastPageParam + jiraQueryMaxResults;
      if (nextPageStartIndex >= issueKeys.length - 1) return;
      return nextPageStartIndex;
    },
    enabled: enabled && issueKeys.length > 0,
    retry: 1,
    ...queryProps,
  });
  return {
    ...query,
    keysFetched: issueKeys.slice(
      0,
      (query.data?.pageParams.slice(-1)[0] || 0) + jiraQueryMaxResults,
    ),
  };
};

/**
 *  Get paginated issue data by providing list of issueKeys and a searchFilter string.
 *  The query tries to get issuedata of all issues from Jira whose summary contains searchFilter and
 *  whose issueKey is in the provided issueKeys list.
 *  Queries JiraQueryMaxResults amount of issues per page.
 */
export const useSearchIssues = ({
  issueKeys,
  searchFilter,
  ...queryProps
}: UseSearchIssuesProps) => {
  const query = useInfiniteQuery({
    queryKey: ["issueSearch", searchFilter],
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      return await getIssues(
        `key in (${issueKeys
          .map((key) => `'${key}'`)
          .join(
            ", ",
          )}) ${searchFilter ? `AND summary ~ '${searchFilter.trim()}*'` : ""} ORDER BY key DESC`,
        pageParam,
      );
    },
    enabled: !!searchFilter,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPageStartIndex = lastPageParam + jiraQueryMaxResults;
      if (nextPageStartIndex >= lastPage.total) return;
      return nextPageStartIndex;
    },
    retry: 1,
    ...queryProps,
  });

  return {
    ...query,
  };
};
