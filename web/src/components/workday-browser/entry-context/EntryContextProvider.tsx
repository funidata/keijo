import { ReactNode, useCallback, useState } from "react";
import { EntryContext } from "./EntryContext";
import { Dayjs } from "dayjs";
import { EntryTemplateType } from "../../../graphql/generated/graphql";

type EntryContextProviderProps = {
  children: ReactNode;
};

export const EntryContextProvider = ({ children }: EntryContextProviderProps) => {
  const [selectedEntries, setSelected] = useState<EntryTemplateType[]>([]);
  const [editDate, setDate] = useState<Dayjs | null>(null);

  const addSelectedEntry = (entry: EntryTemplateType) => setSelected((prev) => [...prev, entry]);
  const removeSelectedEntry = useCallback(
    (entry: EntryTemplateType) =>
      setSelected((prev) => prev.filter((prevEntry) => prevEntry.key !== entry.key)),
    [],
  );
  const hasEntry = (entry: EntryTemplateType) =>
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
