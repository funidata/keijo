import axios from "axios";
import { keijoJiraApiUrl } from "./jiraConfig";

const axiosKeijo = axios.create({
  baseURL: keijoJiraApiUrl,
  withCredentials: true,
});

export { axiosKeijo };
