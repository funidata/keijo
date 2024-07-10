export const jiraApiBaseUrl = "https://api.atlassian.com/ex/jira/";

export const jiraApiVersion = "2";

export const jiraApiPath = "/rest/api/";

export const keijoJiraApiUrl = import.meta.env.VITE_KEIJO_JIRA_API_URL || "/jira";

// Maximum number of results that is provided in one api call
export const jiraQueryMaxResults = 100;
