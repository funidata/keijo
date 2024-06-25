import {
  UseQueryResult,
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { axiosJira, axiosKeijo } from "./axiosInstance";
import { jiraQueryMaxResults } from "./jiraConfig";

export type JiraIssueResult = {
  issues: Array<{ key: string; fields: { summary: string } }>;
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
    await axiosJira.post(
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

export const useGetIssues = ({
  issueKeys,
  enabled,
}: UseGetIssuesProps): UseInfiniteQueryResult<{
  pages: JiraIssueResults;
  pageParams: Array<number>;
}> => {
  const { data: tokenData } = useGetAccessToken();
  return useInfiniteQuery({
    queryKey: ["issues"],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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
    enabled: enabled && !!tokenData?.access_token,
  });
};

export const useSearchIssues = ({
  issueKeys,
  searchFilter,
}: UseSearchIssuesProps): UseInfiniteQueryResult<{
  pages: JiraIssueResults;
  pageParams: Array<number>;
}> => {
  const { data: tokenData } = useGetAccessToken();
  const filteredKeys = issueKeys.filter((option) =>
    option.toLowerCase().trim().includes(searchFilter.toLowerCase().trim()),
  );
  return useInfiniteQuery({
    queryKey: ["issueSearch", searchFilter],
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      return await getIssues(
        `${filteredKeys.length ? `key in (${filteredKeys.map((key) => `'${key}'`).join(", ")}) OR ` : ""}key in (${issueKeys
          .map((key) => `'${key}'`)
          .join(
            ", ",
          )}) ${searchFilter ? `AND summary ~ '${searchFilter.trim()}*'` : ""} ORDER BY key ASC`,
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
  });
};

export const useIsJiraAuthenticated = () => {
  const { data, error, isLoading } = useGetAccessToken();
  return { isJiraAuth: !isLoading && data && !error, data, error };
};
