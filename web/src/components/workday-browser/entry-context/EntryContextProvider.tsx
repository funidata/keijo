import { ReactNode, useState } from "react";
import { EntryContext } from "./EntryContext";
import { Entry } from "../../../graphql/generated/graphql";

type EntryContextProviderProps = {
  children: ReactNode;
};

export const EntryContextProvider = ({ children }: EntryContextProviderProps) => {
  const [selectedEntry, setSelected] = useState<Entry | null>(null);
  const setSelectedEntry = (entry: Entry | null) => setSelected(entry);

  return (
    <EntryContext.Provider value={{ selectedEntry, setSelectedEntry }}>
      {children}
    </EntryContext.Provider>
  );
};
