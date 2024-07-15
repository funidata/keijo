/**
 * Find a word in a string that matches to some Jira issue key(s)
 * by containing atleast the issueKey part preceding the dash (project key).
 */
export const findWordInKeys = (searchFilter: string, issueKeys: string[]) =>
  searchFilter
    .toLowerCase()
    .trim()
    .split(" ")
    .find(
      (word) =>
        word &&
        issueKeys.some(
          (key) =>
            word.trim() &&
            key.toLowerCase().trim().split("-")[0] === word.trim().split("-")[0] &&
            key.toLowerCase().trim().includes(word.trim()),
        ),
    );

export const findKeysIncludingWord = (word: string, issueKeys: string[]) =>
  word
    ? issueKeys.filter((key) => key.toLowerCase().trim().includes(word?.toLowerCase().trim()))
    : [];

export const removeWord = (searchFilter: string, word: string) =>
  word
    ? searchFilter
        .toLowerCase()
        .trim()
        .split(" ")
        .filter((text) => text.trim() !== word)
        .join(" ")
    : searchFilter;
