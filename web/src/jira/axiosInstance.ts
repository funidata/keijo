import axios from "axios";
import { useNotificationState } from "../components/global-notification/useNotification";
import { JiraAuthLink } from "./jiraAuthLink";
import { jiraApiUrl, keijoJiraApiUrl } from "./jiraConfig";
import { queryClient } from "./queryClient";

export const axiosJira = axios.create({
  baseURL: jiraApiUrl,
});

const axiosKeijo = axios.create({
  baseURL: keijoJiraApiUrl,
  withCredentials: true,
});

axiosJira.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.log(err.response.status);
    if (err.response.status === 403 || err.response.status === 401) {
      await queryClient.fetchQuery({
        queryKey: ["accessToken"],
        queryFn: async () => (await axiosKeijo.get("/refresh")).data,
      });
    }
    return Promise.reject(err);
  },
);

axiosKeijo.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(err.response.status);
    if (err.response.status === 401) {
      useNotificationState.getState().setNotification({
        message: "Jira is not authenticated for Keijo",
        type: "warning",
        autoHide: false,
        action: JiraAuthLink,
      });
    }

    return Promise.reject(err);
  },
);

export { axiosKeijo };
