import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { axiosJira, axiosKeijo } from "./axiosInstance";

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

export const useIsJiraAuthenticated = () => {
  const { data, error, isLoading } = useGetAccessToken();
  return { isJiraAuth: !isLoading && !error && !!data, data, error, isLoading };
};
