import { createContext } from "react";
import { Entry } from "../../../graphql/generated/graphql";

type EntryContextValue = {
  selectedEntries: Entry[];
  addSelectedEntry: (entry: Entry) => void;
  removeSelectedEntry: (entry: Entry) => void;
  clearEntries: () => void;
  hasEntry: (entry: Entry) => boolean;
  hasEntries: boolean;
  toggleEditing: () => void;
  isEditing: boolean;
};

export const EntryContext = createContext<EntryContextValue | undefined>(undefined);
