import { useLocalStorage } from "usehooks-ts";

const SET_REMAINING_HOURS_LOCAL_STORAGE_KEY = "use-set-remaining-hours";

const usePreferSetRemainingHours = () => {
  const [userPrefersSetRemainingHours, setUserSetRemainingHours] = useLocalStorage<
    boolean | undefined
  >(SET_REMAINING_HOURS_LOCAL_STORAGE_KEY, undefined);

  const toggleRemainingHours = () => {
    setUserSetRemainingHours(!userPrefersSetRemainingHours);
  };

  return {
    userPrefersSetRemainingHours,
    toggleRemainingHours,
  };
};

export default usePreferSetRemainingHours;
