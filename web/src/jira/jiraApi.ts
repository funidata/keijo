import {
  UseQueryResult,
  useQuery,
  useInfiniteQuery,
  QueryKey,
  InfiniteData,
  UndefinedInitialDataInfiniteOptions,
} from "@tanstack/react-query";
import { axiosJira, axiosKeijo } from "./axiosInstance";
import { jiraQueryMaxResults } from "./jiraConfig";

export type JiraIssueResult = {
  issues: Array<{ key: string; fields: { summary: string } }>;
  total: number;
};
export type JiraIssueResults = Array<JiraIssueResult>;

type UseGetIssuesProps = {
  issueKeys: Array<string>;
  enabled?: boolean;
};

type UseSearchIssuesProps = {
  issueKeys: Array<string>;
  searchFilter: string;
};

const getAccessToken = async () => {
  return (await axiosKeijo.get("/access-token")).data;
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
  accessToken: string,
  startAt: number = 0,
  numOfIssues: number = jiraQueryMaxResults,
) => {
  return (
    await axiosJira.post<JiraIssueResult>(
      "/search",
      {
        fields: ["summary"],
        maxResults: numOfIssues,
        startAt: startAt,
        validateQuery: "warn",
        jql: jql,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
  ).data;
};

/**
 *  Get paginated issue data (e.g, summary) by providing a list of issuekeys.
 *  Queries JiraQueryMaxResults amount of issues per page.
 */
export const useGetIssues = ({
  issueKeys,
  enabled,
  ...queryProps
}: UseGetIssuesProps &
  Partial<
    UndefinedInitialDataInfiniteOptions<
      JiraIssueResult,
      Error,
      InfiniteData<JiraIssueResult, number>,
      QueryKey,
      number
    >
  >) => {
  const { data: tokenData } = useGetAccessToken();
  const query = useInfiniteQuery<
    JiraIssueResult,
    Error,
    InfiniteData<JiraIssueResult, number>,
    QueryKey,
    number
  >({
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
        tokenData?.access_token || "",
        0,
      );
    },
    initialPageParam: 0,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      const nextPageStartIndex = lastPageParam + jiraQueryMaxResults;
      if (nextPageStartIndex >= issueKeys.length - 1) return;
      return nextPageStartIndex;
    },
    enabled: enabled && !!tokenData?.access_token && issueKeys.length > 0,
    retry: 1,
    ...queryProps,
  });
  return {
    ...query,
    issueData: (query.data?.pages || []).flatMap((page) =>
      page.issues.map((issue) => ({ key: issue.key, summary: issue.fields.summary })),
    ),
    keysFetched: issueKeys.slice(
      0,
      (query.data?.pageParams.slice(-1)[0] || 0) + jiraQueryMaxResults,
    ),
    lastPageData: query.data?.pages
      .slice(-1)[0]
      .issues.map((issue) => ({ key: issue.key, summary: issue.fields.summary })),
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
}: UseSearchIssuesProps &
  Partial<
    UndefinedInitialDataInfiniteOptions<
      JiraIssueResult,
      Error,
      InfiniteData<JiraIssueResult, number>,
      QueryKey,
      number
    >
  >) => {
  const { data: tokenData } = useGetAccessToken();

  const query = useInfiniteQuery<
    JiraIssueResult,
    Error,
    InfiniteData<JiraIssueResult, number>,
    QueryKey,
    number
  >({
    queryKey: ["issueSearch", searchFilter],
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      return await getIssues(
        `key in (${issueKeys
          .map((key) => `'${key}'`)
          .join(
            ", ",
          )}) ${searchFilter ? `AND summary ~ '${searchFilter.trim()}*'` : ""} ORDER BY key DESC`,
        tokenData?.access_token || "",
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
    lastPageData: query.data?.pages
      .slice(-1)[0]
      .issues.map((issue) => ({ key: issue.key, summary: issue.fields.summary })),
    issueData: (query.data?.pages || []).flatMap((page) =>
      page.issues.map((issue) => ({ key: issue.key, summary: issue.fields.summary })),
    ),
  };
};

export const useIsJiraAuthenticated = () => {
  const { data, error, isLoading } = useGetAccessToken();
  return { isJiraAuth: !isLoading && data && !error, data, error };
};
