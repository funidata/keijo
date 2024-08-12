import { ReactNode, useCallback, useEffect, useState } from "react";
import { EntryContext } from "./EntryContext";
import { Entry } from "../../../graphql/generated/graphql";
import { Dayjs } from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (editDate !== null && hasEntries && !location.pathname.match(/\/create\/?$/)) {
      const entry = selectedEntries[0];
      removeSelectedEntry(entry);
      navigate(`${location.pathname}/create`, {
        state: { date: editDate.format("YYYY-MM-DD"), template: entry },
      });
    } else if (!hasEntries) {
      setEditDate(null);
    }
  }, [
    editDate,
    hasEntries,
    location.pathname,
    navigate,
    removeSelectedEntry,
    selectedEntries,
    setEditDate,
  ]);

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
