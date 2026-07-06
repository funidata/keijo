import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { axiosKeijo } from "./axiosInstance";

type JiraStatus = {
  authenticated: boolean;
};

const getJiraStatus = async (): Promise<JiraStatus> => {
  const result = await axiosKeijo.get<JiraStatus>("/status");
  return result.data;
};

const useGetJiraStatus = (): UseQueryResult<JiraStatus> => {
  return useQuery({
    queryKey: ["jiraStatus"],
    queryFn: getJiraStatus,
    retry: false,
  });
};

export const useIsJiraAuthenticated = () => {
  const { data, error, isLoading } = useGetJiraStatus();
  return {
    isJiraAuth: !!data?.authenticated,
    data,
    error,
    isLoading,
  };
};
