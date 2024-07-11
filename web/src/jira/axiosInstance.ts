import axios from "axios";
import { useNotificationState } from "../components/global-notification/useNotification";
import { jiraApiPath, jiraApiBaseUrl, keijoJiraApiUrl, jiraApiVersion } from "./jiraConfig";

import { JiraAuthLink } from "./components/JiraAuthLink";

const axiosJira = axios.create({});

const axiosKeijo = axios.create({
  baseURL: keijoJiraApiUrl,
  withCredentials: true,
});

axiosKeijo.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 403 || err.response.status === 401) {
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

axiosJira.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response.status === 403 || err.response.status === 401) {
      const token = (await axiosKeijo.get("/refresh")).data;
      axiosJira.defaults.headers.common.Authorization = "Bearer " + token.access_token;
    }
    useNotificationState.getState().setNotification({
      message: "Failed to fetch issue data from Jira: " + err.response.status,
      type: "error",
      autoHide: true,
    });
    return Promise.reject(err);
  },
);

axiosJira.interceptors.request.use(async (config) => {
  if (!axiosJira.defaults.baseURL || !axiosJira.defaults.headers.common.Authorization) {
    const token = (await axiosKeijo.get("/access-token")).data;
    const jiraUrl = `${jiraApiBaseUrl}${token.cloud_id}${jiraApiPath}${jiraApiVersion}`;
    axiosJira.defaults.baseURL = jiraUrl;
    config.baseURL = jiraUrl;
    axiosJira.defaults.headers.common.Authorization = "Bearer " + token.access_token;
    config.headers.Authorization = "Bearer " + token.access_token;
  }
  return config;
});

export { axiosKeijo, axiosJira };
