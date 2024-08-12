import { useLocalStorage } from "usehooks-ts";
import { GetMySettingsDocument, UpdateSettingsDocument } from "../../graphql/generated/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";

const SET_REMAINING_HOURS_LOCAL_STORAGE_KEY = "use-set-remaining-hours";

const usePreferSetRemainingHours = () => {
  const [userPrefersSetRemainingHours, setUserSetRemainingHours] = useLocalStorage<
    boolean | undefined
  >(SET_REMAINING_HOURS_LOCAL_STORAGE_KEY, undefined);
  const { data: settingsData } = useQuery(GetMySettingsDocument, { fetchPolicy: "network-only" });
  const [updateSettings] = useMutation(UpdateSettingsDocument, {
    refetchQueries: [GetMySettingsDocument],
  });

  const toggleRemainingHours = () => {
    updateSettings({
      variables: { settings: { setRemainingHours: !userPrefersSetRemainingHours } },
    });
    setUserSetRemainingHours((prev) => !prev);
  };

  useEffect(() => {
    const setRemainingdb = settingsData?.getMySettings.setRemainingHours;
    if (setRemainingdb !== null && setRemainingdb !== undefined) {
      setUserSetRemainingHours(setRemainingdb);
    }
  }, [setUserSetRemainingHours, settingsData?.getMySettings.setRemainingHours]);

  return {
    userPrefersSetRemainingHours,
    toggleRemainingHours,
  };
};

export default usePreferSetRemainingHours;
