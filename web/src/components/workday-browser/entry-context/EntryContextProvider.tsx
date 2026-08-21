import { ReactNode, useCallback, useMemo, useState } from "react";
import { EntryContext } from "./EntryContext";
import { Dayjs } from "dayjs";
import { EntryTemplateType } from "../../../graphql/generated/graphql";

type EntryContextProviderProps = {
  children: ReactNode;
};

export const EntryContextProvider = ({ children }: EntryContextProviderProps) => {
  const [selectedEntries, setSelected] = useState<EntryTemplateType[]>([]);
  const [editDate, setDate] = useState<Dayjs | null>(null);

  const addSelectedEntry = useCallback(
    (entry: EntryTemplateType) => setSelected((prev) => [...prev, entry]),
    [],
  );
  const removeSelectedEntry = useCallback(
    (entry: EntryTemplateType) =>
      setSelected((prev) => prev.filter((prevEntry) => prevEntry.key !== entry.key)),
    [],
  );
  const hasEntry = useCallback(
    (entry: EntryTemplateType) => {
      return selectedEntries.some((selectedEntry) => selectedEntry.key === entry.key);
    },
    [selectedEntries],
  );
  const clearEntries = useCallback(() => setSelected([]), []);

  const setEditDate = useCallback((date: Dayjs | null) => {
    setDate(date);
  }, []);
  const hasEntries = useMemo(() => selectedEntries.length > 0, [selectedEntries]);

  const contextValue = useMemo(
    () => ({
      selectedEntries,
      addSelectedEntry,
      removeSelectedEntry,
      clearEntries,
      hasEntry,
      hasEntries,
      editDate,
      setEditDate,
    }),
    [
      selectedEntries,
      addSelectedEntry,
      removeSelectedEntry,
      clearEntries,
      hasEntry,
      hasEntries,
      editDate,
      setEditDate,
    ],
  );

  return <EntryContext.Provider value={contextValue}>{children}</EntryContext.Provider>;
};
