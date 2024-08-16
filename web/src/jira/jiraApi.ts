import {
  UseQueryResult,
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey,
  UseQueryOptions,
} from "@tanstack/react-query";
import { axiosJira, axiosKeijo } from "./axiosInstance";
import { jiraQueryMaxResults } from "./jiraConfig";
import { findKeysIncludingWord, findWordInKeys, removeWord } from "./jiraUtils";
import { jqlAND, jqlOR, jqlOrderBy, jqlRecentIssues, keyIsInKeys, summaryContains } from "./jql";

export type JiraIssueResult = {
  issues: Array<{ key: string; fields: { summary: string } }>;
  total: number;
};

type InfiniteIssueOptions = Partial<
  UseInfiniteQueryOptions<
    JiraIssueResult,
    Error,
    InfiniteData<JiraIssueResult, number>,
    JiraIssueResult,
    QueryKey,
    number
  >
>;

type UseGetIssuesProps = {
  issueKeys: Array<string>;
  enabled?: boolean;
} & InfiniteIssueOptions;

type UseSearchIssuesProps = {
  issueKeys: Array<string>;
  searchFilter: string;
} & InfiniteIssueOptions;

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
        keyIsInKeys(issueKeys.slice(pageParam, pageParam + jiraQueryMaxResults)),
        0,
      );
    },
    initialPageParam: 0,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      const nextPageStartIndex = lastPageParam + jiraQueryMaxResults;
      if (nextPageStartIndex >= issueKeys.length - 1) {
        return;
      }
      return nextPageStartIndex;
    },
    enabled: enabled && issueKeys.length > 0,
    retry: 2,
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
 *  whose issueKey is in the provided issueKeys list. Also, if searchFilter contains a word matching
 *  some issueKey(s) by atleast with the project key, then query if the summaries of those issueKey(s) contain
 *  the edited searchFilter with the matching word removed. This is useful if we want to search an issue
 *  with some key+summary searchFilter since Jira allows "fuzzy" string search
 *  only for text fields, not issue keys, so we need to match the searchFilter with the issue key by ourselves.
 *  Queries JiraQueryMaxResults amount of issues per page.
 */
export const useSearchIssues = ({
  issueKeys,
  searchFilter,
  ...queryProps
}: UseSearchIssuesProps) => {
  const wordInKeys =
    searchFilter.trim().split(" ").length > 1 && findWordInKeys(searchFilter, issueKeys);

  const keysIncludingWord = wordInKeys ? findKeysIncludingWord(wordInKeys, issueKeys) : [];
  const searchWithoutWord = wordInKeys ? removeWord(searchFilter, wordInKeys) : "";

  const jql = wordInKeys
    ? jqlOR(
        jqlAND(keyIsInKeys(issueKeys), summaryContains(searchFilter)),
        jqlAND(keyIsInKeys(keysIncludingWord), summaryContains(searchWithoutWord)),
      )
    : jqlAND(keyIsInKeys(issueKeys), summaryContains(searchFilter));

  const query = useInfiniteQuery({
    queryKey: ["issueSearch", searchFilter],
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      return await getIssues(jqlOrderBy(jql, "key"), pageParam);
    },
    enabled: !!searchFilter,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPageStartIndex = lastPageParam + jiraQueryMaxResults;
      if (nextPageStartIndex >= lastPage.total) {
        return;
      }
      return nextPageStartIndex;
    },
    retry: 2,
    ...queryProps,
  });

  return {
    ...query,
  };
};

/**
 * Get users recent issues
 */
export const useRecentIssues = (
  queryProps?: Partial<UseQueryOptions<JiraIssueResult>>,
): UseQueryResult<JiraIssueResult> =>
  useQuery({
    queryKey: ["recentIssues"],
    queryFn: async () => {
      return await getIssues(jqlOrderBy(jqlRecentIssues(), "lastViewed", "DESC"));
    },
    retry: 2,
    ...queryProps,
  });
