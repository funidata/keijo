import { useLocalStorage } from "usehooks-ts";
import { EntryFormSchema } from "../entry-dialog/useEntryForm";

const DEFAULT_ENTRY_VALUES = "default-entry-values";

type DefaultEntryValues = Partial<EntryFormSchema>;

const useDefaultEntryValues = () => {
  const [defaultEntryValues, setDefaultEntryValues] = useLocalStorage<
    DefaultEntryValues | undefined
  >(DEFAULT_ENTRY_VALUES, undefined);

  const setDefaultValues = (defaultValues: DefaultEntryValues) => {
    setDefaultEntryValues(defaultValues);
  };

  return {
    defaultEntryValues,
    setDefaultValues,
  };
};

export default useDefaultEntryValues;
