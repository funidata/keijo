import { keijoJiraApiUrl } from "./jiraConfig";

export const mergePages = <T>(...arrays: T[][][]): T[][] => {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  return Array.from({ length: maxLength }, (_, i) => {
    return arrays.reduce((acc: T[], array) => {
      return acc.concat(array[i] || []);
    }, []);
  });
};

export const chunkArray = <T>(array: T[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
};

/**
 * Find a word in a string that matches to some Jira issue key(s)
 * by containing atleast the issueKey part preceding the dash (project key).
 */
export const findWordInKeys = (searchFilter: string, issueKeys: string[]) => {
  const words = searchFilter.match(/\S+/gi);
  if (!words || words.length < 2) {
    return;
  }
  return words.find(
    (word) =>
      word &&
      issueKeys.some(
        (key) =>
          word.trim() &&
          word.toLowerCase().split("-")[0] === key.toLowerCase().split("-")[0] &&
          key.toLowerCase().includes(word.toLowerCase()),
      ),
  );
};

export const findKeysIncludingWord = (word: string, issueKeys: string[]) =>
  issueKeys.filter((key) => key.toLowerCase().includes(word.toLowerCase()));

export const stringWithoutWord = (searchFilter: string, word: string) =>
  searchFilter
    .trim()
    .match(/\S+/gi)
    ?.filter((text) => text.trim().toLowerCase() !== word.toLowerCase())
    .join(" ") || searchFilter;

export const connectToJira = () => {
  window.location.href = keijoJiraApiUrl;
};

export const disconnectJira = () => {
  window.location.href = keijoJiraApiUrl + "/remove-session";
};
