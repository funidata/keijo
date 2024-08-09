import { ReactNode, useState } from "react";
import { EntryContext } from "./EntryContext";
import { Entry } from "../../../graphql/generated/graphql";

type EntryContextProviderProps = {
  children: ReactNode;
};

export const EntryContextProvider = ({ children }: EntryContextProviderProps) => {
  const [selectedEntries, setSelected] = useState<Entry[]>([]);
  const [isEditing, setEditing] = useState(false);

  const toggleEditing = () => setEditing((prev) => !prev);

  const addSelectedEntry = (entry: Entry) => setSelected((prev) => [...prev, entry]);
  const removeSelectedEntry = (entry: Entry) =>
    setSelected((prev) => prev.filter((prevEntry) => prevEntry.key !== entry.key));
  const hasEntry = (entry: Entry) =>
    !!selectedEntries.find((prevEntry) => prevEntry.key === entry.key);
  const clearEntries = () => setSelected([]);

  return (
    <EntryContext.Provider
      value={{
        selectedEntries,
        addSelectedEntry,
        removeSelectedEntry,
        clearEntries,
        hasEntry,
        hasEntries: selectedEntries.length > 0,
        isEditing,
        toggleEditing,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};
