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
import { findKeysIncludingWord, findWordInKeys, removeWord } from "./jiraUtils";
import { jqlAND, jqlOR, jqlOrderBy, keyIsInKeys, summaryContains } from "./jql";

export type JiraIssueResult = {
  issues: Array<{ key: string; fields: { summary: string } }>;
  total: number;
};

type UseGetIssuesProps = {
  issueKeys: Array<string>;
  searchFilter?: string;
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
export const useGetIssues = ({
  issueKeys,
  searchFilter,
  enabled,
  ...queryProps
}: UseGetIssuesProps) => {
  const keysToFetch = [
    ...(searchFilter
      ? issueKeys.filter((option) =>
          option.toLowerCase().trim().includes(searchFilter.toLowerCase().trim()),
        )
      : issueKeys),
  ];

  const wordInKeys =
    searchFilter &&
    searchFilter.trim().split(" ").length > 1 &&
    findWordInKeys(searchFilter, issueKeys);

  const keysIncludingWord = wordInKeys ? findKeysIncludingWord(wordInKeys, issueKeys) : [];
  const searchWithoutWord = wordInKeys ? removeWord(searchFilter, wordInKeys) : "";

  const searchJql = wordInKeys
    ? jqlOR(
        jqlAND(keyIsInKeys(issueKeys), summaryContains(searchFilter)),
        jqlAND(keyIsInKeys(keysIncludingWord), summaryContains(searchWithoutWord)),
      )
    : searchFilter && jqlAND(keyIsInKeys(issueKeys), summaryContains(searchFilter));

  const jql =
    searchJql && keysToFetch.length
      ? jqlOR(keyIsInKeys(keysToFetch), searchJql)
      : searchJql || keyIsInKeys(keysToFetch);

  return useInfiniteQuery({
    queryKey: ["issues", ...issueKeys, searchFilter],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      return await getIssues(jqlOrderBy(jql, "lastviewed", "DESC"), pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPageStartIndex = lastPageParam + jiraQueryMaxResults;
      if (nextPageStartIndex >= lastPage.total) {
        return;
      }
      return nextPageStartIndex;
    },
    enabled: enabled && issueKeys.length > 0,
    retry: 2,
    ...queryProps,
  });
};
