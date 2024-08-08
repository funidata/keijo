import { createContext } from "react";
import { Entry } from "../../../graphql/generated/graphql";

type EntryContextValue = {
  selectedEntry: Entry | null;
  setSelectedEntry: (entry: Entry | null) => void;
};

export const EntryContext = createContext<EntryContextValue | undefined>(undefined);
