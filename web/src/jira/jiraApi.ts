import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { axiosJira, axiosKeijo } from "./axiosInstance";
import { jiraQueryMaxResults } from "./jiraConfig";

export type JiraIssueResults = Array<{
  issues: Array<{ key: string; fields: { summary: string } }>;
}>;

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

const getAllIssues = async (issueKeys: Array<string>, accessToken: string) => {
  const promises = [];
  const issues = Array.from(issueKeys);
  while (issues.length) {
    const issuesToGet = issues.splice(0, jiraQueryMaxResults);
    promises.push(getIssues(issuesToGet, accessToken));
  }
  return await Promise.all(promises);
};

export const useGetIssues = (
  issueKeys: Array<string>,
  enabled: boolean = true,
): UseQueryResult<JiraIssueResults> => {
  const { data: tokenData } = useGetAccessToken();
  return useQuery({
    queryKey: ["issue", ...issueKeys],
    queryFn: async () => await getAllIssues(issueKeys, tokenData?.access_token || ""),
    retry: 1,
    enabled: enabled && !!tokenData?.access_token,
  });
};
