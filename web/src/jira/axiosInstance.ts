import axios from "axios";
import { useNotificationState } from "../components/global-notification/useNotification";
import { jiraApiUrl, keijoJiraApiUrl } from "./jiraConfig";

import { JiraAuthLink } from "./components/JiraAuthLink";

const axiosJira = axios.create({
  baseURL: jiraApiUrl,
});

const axiosKeijo = axios.create({
  baseURL: keijoJiraApiUrl,
  withCredentials: true,
});

axiosKeijo.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      useNotificationState.getState().setNotification({
        message: "Jira is not authenticated. Keijo uses Jira for e.g., receiving issue summaries.",
        type: "warning",
        autoHide: true,
        action: JiraAuthLink,
      });
    }

    return Promise.reject(err);
  },
);

/*
  Try to 
**/
axiosJira.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response.status === 403 || err.response.status === 401) {
      const token = (await axiosKeijo.get("/refresh")).data;
      if (token && err?.config && !err.config._retry) {
        err.config._retry = true;
        err.config.headers["Authorization"] = "Bearer " + token.access_token;
        return axiosJira(err.config);
      }
    }
    useNotificationState.getState().setNotification({
      message: "Failed to fetch issue data from Jira: " + err.response.status,
      type: "error",
      autoHide: true,
    });
    return Promise.reject(err);
  },
);

export { axiosKeijo, axiosJira };
