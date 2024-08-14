import { ReactNode, useCallback, useState } from "react";
import { EntryContext } from "./EntryContext";
import { Entry } from "../../../graphql/generated/graphql";
import { Dayjs } from "dayjs";

type EntryContextProviderProps = {
  children: ReactNode;
};

export const EntryContextProvider = ({ children }: EntryContextProviderProps) => {
  const [selectedEntries, setSelected] = useState<Entry[]>([]);
  const [editDate, setDate] = useState<Dayjs | null>(null);

  const addSelectedEntry = (entry: Entry) => setSelected((prev) => [...prev, entry]);
  const removeSelectedEntry = useCallback(
    (entry: Entry) =>
      setSelected((prev) => prev.filter((prevEntry) => prevEntry.key !== entry.key)),
    [],
  );
  const hasEntry = (entry: Entry) =>
    !!selectedEntries.find((prevEntry) => prevEntry.key === entry.key);
  const clearEntries = () => setSelected([]);

  const setEditDate = useCallback((date: Dayjs | null) => {
    setDate(date);
  }, []);
  const hasEntries = selectedEntries.length > 0;

  return (
    <EntryContext.Provider
      value={{
        selectedEntries,
        addSelectedEntry,
        removeSelectedEntry,
        clearEntries,
        hasEntry,
        hasEntries,
        editDate,
        setEditDate,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};
