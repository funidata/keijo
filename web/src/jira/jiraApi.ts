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

const getAccessToken = async () => {
  return (await axiosKeijo.get("/access-token")).data;
};

const useGetAccessToken = (): UseQueryResult<{ access_token: string }> => {
  return useQuery({
    queryKey: ["accessToken"],
    queryFn: async () => await getAccessToken(),
    retry: 1,
  });
};

const getIssues = async (
  issueKeys: Array<string>,
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
        jql: `key in (${issueKeys.map((key) => `'${key}'`).join(", ")})`,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
  ).data;
};

export const useGetIssues = (
  issueKeys: Array<string>,
  enabled: boolean = true,
): UseInfiniteQueryResult<{ pages: JiraIssueResults; pageParams: Array<number> }> => {
  const { data: tokenData } = useGetAccessToken();

  return useInfiniteQuery({
    queryKey: ["issues"],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam }) =>
      await getIssues(issueKeys, tokenData?.access_token || "", pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const allResultsFetched = lastPage && lastPage.total === lastPage.issues.length;
      const nextPageStartIndex = lastPageParam + jiraQueryMaxResults;
      if (allResultsFetched || nextPageStartIndex >= issueKeys.length - 1) return;
      return nextPageStartIndex;
    },
    enabled: enabled && !!tokenData?.access_token,
  });
};
