import { useLocalStorage, useMediaQuery } from "usehooks-ts";

const DARK_MODE_LOCAL_STORAGE_KEY = "use-dark-mode";

/**
 * Use and toggle dark mode preference.
 *
 * Persists dark mode selection in local storage and falls back to browser's
 * preference if user has not switched between dark and light mode.
 *
 * Created because I could not get the `useDarkMode` from `usehooks-ts` to work properly.
 */
const useDarkMode = () => {
  // This is unstable and cannot be used for initialization.
  const browserPrefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [userPrefersDarkMode, setUserPrefersDarkMode] = useLocalStorage<boolean | undefined>(
    DARK_MODE_LOCAL_STORAGE_KEY,
    undefined,
  );

  const darkMode = userPrefersDarkMode ?? browserPrefersDarkMode;

  const toggleDarkMode = () => {
    setUserPrefersDarkMode(!darkMode);
  };

  return {
    darkMode,
    toggleDarkMode,
  };
};

export default useDarkMode;
