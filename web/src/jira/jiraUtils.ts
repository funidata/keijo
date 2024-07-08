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
