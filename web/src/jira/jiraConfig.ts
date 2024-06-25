export const jiraApiUrl = import.meta.env.VITE_JIRA_API_URL;

export const keijoJiraApiUrl = import.meta.env.VITE_KEIJO_JIRA_API_URL || "/jira";

// Maximum number of results that is provided in one api call
export const jiraQueryMaxResults = 100;
